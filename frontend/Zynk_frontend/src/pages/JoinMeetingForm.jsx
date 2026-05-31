import React, { useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../styles/JoinMeetForm.css";
import Button from "@mui/material/Button";

function JoinMeetingForm() {
  let navigate = useNavigate();
  let [meetingCode, setMeetingCode] = useState("");

  let handleJoinMeet = async () => {
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <div className="page">
        <div className="Navbar">
          <div className="navHeader">
            <h2>
              {" "}
              <span style={{ color: "#FF9839" }}>Zynk</span> Meet
            </h2>
          </div>
          <div>
            {" "}
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/home");
              }}
              variant="outlined"
            >
              logOut
            </Button>
          </div>
        </div>

        <div className="meetCode">
          <div className="codeinput">
            <h2>Enter Meeting Code</h2>
            <input
              type="text"
              required
              onChange={(e) => setMeetingCode(e.target.value)}
            />

            <button onClick={handleJoinMeet} className="joinBtn">Join Meeting</button>
          </div>

          <div className="image">
            <img src="/joinmeet-removebg.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default JoinMeetingForm;
