import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="LandingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>
            {" "}
            <span style={{ color: "#FF9839" }}>Zynk</span> Meet
          </h2>
        </div>
        <div className="navList">
          <p
            onClick={() => {
              router("/yfEjhvbuy");
            }}
          >
            Join as guest
          </p>
          <p
            onClick={() => {
              router("/auth");
            }}
          >
            Register
          </p>
          <div role="button" className="logBtn">
            <p
              onClick={() => {
                router("/auth");
              }}
            >
              Login
            </p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> with your <br />{" "}
            loved ones
          </h1>
          <br />
          <p>Cover a distance by Zynk Meet</p>
          <div role="Button" className="authBtn">
            <a href="/auth">Get Started</a>
          </div>
        </div>
        <div>
          <img src="/mobile3.png" alt="mobile" />
        </div>
      </div>
    </div>
  );
}
