import React from "react";
import "../App.css";

export default function LandingPage() {
  return (
    <div className="LandingPageContainer">
      <nav>
        <div className="navHeader">
          <h2 > <span style={{ color: "#FF9839" }}>Zynk</span> Meet</h2>
        </div>
        <div className="navList">
          <p>Join as guest</p>
          <p>Register</p>
          <div role="button" className="logBtn">
            <p>Login</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> with your <br /> loved
            ones
          </h1><br />
          <p>Cover a distance by Zynk Meet</p>
          <div role="Button" className="authBtn">
          <a href="/auth">Get Started</a>
          </div>
        </div>
        <div>
          <img src="/mobile3.png" alt="" />
        </div>
      </div>
    </div>
  );
}
