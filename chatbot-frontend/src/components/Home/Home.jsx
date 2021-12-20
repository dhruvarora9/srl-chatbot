import { useState } from "react";
import NavBar from "../Navbar/NavBar";
import BotChat from "../BotChat/BotChat";
import "./Home.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("botchat");
  return (
    <div className="home-rootContainer">
      <div className="home-adminLoginButton">
        <Link className="btn btn-light m-2" role="button" to="/login">
          Admin
        </Link>
      </div>

      <div className="home-mainContainer">
        <NavBar />
        <div className="home-chatContainer">
          {currentPage === "botchat" && <BotChat />}
        </div>
      </div>
    </div>
  );
};

export default Home;
