import React from "react";
import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="navbar-rootContainer">
      <div className="navbar-headerContainer">
        {/* <div className="navbar-logo"></div> */}
        <div className="navbar-headerTextContainer">
          <span className="navbar-headerText1">Ask SRL</span>
          <span className="navbar-headerText2">Your Virtual Assistant</span>
        </div>
      </div>
      <div className="navbar-navContainer"></div>
    </div>
  );
}
