import React from "react";
import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="navbar-rootContainer">
      <div className="flex justify-between p-2">
        {/* <div className="navbar-logo"></div> */}
        <div className="navbar-headerTextContainer">
          <span className="navbar-headerText1">Ask SRL</span>
          <span className="navbar-headerText2">Your Virtual Assistant</span>
        </div>
        <div>
          <button className="bg-sky-300 px-2 py-1 rounded-md text-white font-semibold">
            Live Chat
          </button>
        </div>
      </div>
      <div className="navbar-navContainer"></div>
    </div>
  );
}
