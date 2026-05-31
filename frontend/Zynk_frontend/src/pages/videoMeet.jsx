import React, { useRef, useState, useEffect } from "react";
import "../styles/videoMeet.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import IconButton from "@mui/material/IconButton";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";


const server_URL = "http://localhost:8080";

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeet() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  const [input, setInput] = useState("");

  let [video, setVideo] = useState(true);

  let [audio, setAudio] = useState(true);

  let [screen, setScreen] = useState();

  let [showModal, setShowModal] = useState(false);

  let [screenAvailable, setScreenAvailable] = useState(true);

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(3);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

   const navigate = useNavigate();

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  let getUserMediaSuccess = async (stream) => {
    try {
      // stop old tracks
      window.localStream?.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    // replace tracks in existing peer connections
    for (let id in connections) {
      if (id === socketRef.current.id) continue;

      const peer = connections[id];

      stream.getTracks().forEach((track) => {
        const sender = peer
          .getSenders()
          .find((s) => s.track && s.track.kind === track.kind);

        if (sender) {
          sender.replaceTrack(track);
        } else {
          peer.addTrack(track, stream);
        }
      });

      try {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socketRef.current.emit(
          "signal",
          id,
          JSON.stringify({
            sdp: peer.localDescription,
          }),
        );
      } catch (e) {
        console.log(e);
      }
    }

    // track ended handler
    stream.getTracks().forEach((track) => {
      track.onended = async () => {
        setVideo(false);
        setAudio(false);

        const blackSilenceStream = new MediaStream([black(), silence()]);

        window.localStream = blackSilenceStream;
        localVideoRef.current.srcObject = blackSilenceStream;

        for (let id in connections) {
          const peer = connections[id];

          blackSilenceStream.getTracks().forEach((newTrack) => {
            const sender = peer
              .getSenders()
              .find((s) => s.track && s.track.kind === newTrack.kind);

            if (sender) {
              sender.replaceTrack(newTrack);
            }
          });

          try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({
                sdp: peer.localDescription,
              }),
            );
          } catch (e) {
            console.log(e);
          }
        }
      };
    });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({
          video,
          audio,
        })
        .then((stream) => {
          getUserMediaSuccess(stream);
        })
        .catch((err) => console.log(err));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      } catch {}
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessage) => [
      ...prevMessage,
      { sender: sender, data: data },
    ]);

    if (socketIdSender !== socketIdRef.current) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_URL, { secure: false });
    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;
      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });
      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          if (
            socketListId === socketIdRef.current.id ||
            connections[socketListId]
          ) {
            return;
          }

          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections,
          );
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };
          connections[socketListId].ontrack = (event) => {
            const remoteStream = event.streams[0];

            setVideos((prevVideos) => {
              const exists = prevVideos.find(
                (video) => video.socketId === socketListId,
              );

              if (exists) {
                return prevVideos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: remoteStream }
                    : video,
                );
              }

              return [
                ...prevVideos,
                {
                  socketId: socketListId,
                  stream: remoteStream,
                },
              ];
            });
          };
          if (window.localStream !== undefined && window.localStream !== null) {
            window.localStream.getTracks().forEach((track) => {
              connections[socketListId].addTrack(track, window.localStream);
            });
          } else {
            // let blackSlience
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            window.localStream.getTracks().forEach((track) => {
              connections[socketListId].addTrack(track, window.localStream);
            });
          }
        });
        if (id === socketIdRef.current.id) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription }),
                  );
                })
                .catch((e) => {
                  console.log(e);
                });
            });
          }
        }
      });
    });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      stream.getTracks().forEach((track) => {
        const sender = connections[id]
          .getSenders()
          .find((s) => s.track && s.track.kind === track.kind);

        if (sender) {
          sender.replaceTrack(track);
        }
      });
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }
    stream.getTracks().forEach((track) => {
      track.onended = async () => {
        setScreen(false);

        try {
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          window.localStream = cameraStream;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = cameraStream;
          }

          for (let id in connections) {
            const peer = connections[id];

            cameraStream.getTracks().forEach((track) => {
              const sender = peer
                .getSenders()
                .find((s) => s.track && s.track.kind === track.kind);

              if (sender) {
                sender.replaceTrack(track);
              }
            });

            const offer = await peer.createOffer();

            await peer.setLocalDescription(offer);

            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({
                sdp: peer.localDescription,
              }),
            );
          }
        } catch (e) {
          console.log(e);
        }
      };
    });
  };

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)

          .catch((e) => {
            console.log(e);
          });
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    if (screen) {
      // STOP screen sharing
      window.localStream.getTracks().forEach((track) => {
        track.stop();
      });

      setScreen(false);
    } else {
      // START screen sharing
      setScreen(true);
    }
  };

  let sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  let routeTo = () => {
    useNavigate();
  };

  let handleEndCall = () => {
    const stream = localVideoRef.current?.srcObject;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    navigate("/home");
  };

  return (
    <div className="video-meet-container">
      {askForUsername === true ? (
        <div className="lobbyContainer">
          <div className="lobbyPage">
            <div className="lobbyLeft">
              <h1>
                <span style={{ color: "#FF9839" }}>Zynk</span> Meet
              </h1>
              <p>Connect instantly with your team and friends.</p>

              <input
                className="username"
                required
                id="filled-basic"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                fullWidth
              />

              <Button
                variant="contained"
                onClick={connect}
                className="connectBtn"
              >
                Join Meeting
              </Button>
            </div>

            <div className="lobbyRight">
              <video ref={localVideoRef} autoPlay muted />
            </div>
          </div>

          <div className="buttonContainers">
            <IconButton
              style={{ color: "white" }}
              onClick={() => {
                const enabled = !video;
                setVideo(enabled);

                window.localStream?.getVideoTracks().forEach((track) => {
                  track.enabled = enabled;
                });
              }}
            >
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              sx={{
                color: "white",
              }}
              onClick={() => {
                const enabled = !audio;
                setAudio(enabled);

                window.localStream?.getAudioTracks().forEach((track) => {
                  track.enabled = enabled;
                });
              }}
            >
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
          </div>
        </div>
      ) : (
        <>
          <div className="conferenceView">
            <video
              className="localVideoContainer"
              ref={localVideoRef}
              autoPlay
              muted
            />

            <div className="conferenceVideos">
              {videos.map((video) => (
                <div key={video.socketId}>
                  <video
                    autoPlay
                    playsInline
                    ref={(ref) => {
                      if (ref) {
                        ref.srcObject = video.stream;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {showModal ? (
            <div className="chatRoom">
              <div className="chatContainer">
                <h1>Chats</h1>
                <div className="chatArea">
                  <div className="chatMessages">
                    {messages
                      .filter(
                        (item) =>
                          typeof item.data === "string" &&
                          item.data.trim() !== "",
                      )
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`messageCard ${
                            item.sender === username
                              ? "myMessage"
                              : "otherMessage"
                          }`}
                        >
                          <p className="messageSender">{item.sender}</p>
                          <p className="messageText">{item.data}</p>
                        </div>
                      ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <div className="chatInput">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    id="filled-basic"
                    Placeholder="Type Your Message"
                    variant="outlined"
                    fullWidth
                  />
                  <Button
                    onClick={sendMessage}
                    variant="outlined"
                    color="default"
                  >
                    <SendIcon />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="buttonContainers">
            <IconButton
              style={{ color: "white" }}
              onClick={() => {
                const enabled = !video;
                setVideo(enabled);

                window.localStream?.getVideoTracks().forEach((track) => {
                  track.enabled = enabled;
                });
              }}
            >
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              style={{ color: "white" }}
              onClick={() => {
                const enabled = !audio;
                setAudio(enabled);

                window.localStream?.getAudioTracks().forEach((track) => {
                  track.enabled = enabled;
                });
              }}
            >
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEndIcon />
            </IconButton>

            {screenAvailable && (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>
            )}

            <Badge badgeContent={newMessages} max={999} color="secondary">
              <IconButton
                style={{ color: "white" }}
                onClick={() => setShowModal(!showModal)}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>
        </>
      )}
    </div>
  );
}
