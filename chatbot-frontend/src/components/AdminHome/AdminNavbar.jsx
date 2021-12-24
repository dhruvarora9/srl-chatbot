import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutAdmin } from "../../actions/authAction";

import "./adminhome.styles.css";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <nav
        className="navbar navbar-light"
        style={{ backgroundColor: "#337ab7" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/" style={{ color: "white" }}>
            Admin-Chatbot
          </a>

          <form className="flex py-1">
            <Link role="button" className="btn btn-secondary mx-1" to="/">
              Home
            </Link>
            <button
              className="btn btn-secondary mx-1"
              onClick={() => dispatch(logoutAdmin())}
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
};
export default AdminNavbar;
