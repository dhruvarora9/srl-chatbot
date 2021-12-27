import React, { useState } from "react";
import "./adminhome.styles.css";
import AdminNavbar from "./AdminNavbar";
import AdminAnsweredQuestions from "./AdminTables/AdminAnsweredQuestions";
import AdminInvalidQuestion from "./AdminTables/AdminInvalidQuestions";
import AdminValidQuestion from "./AdminTables/AdminValidQuestions";

const AdminHome = (props) => {
  const [currentPage, setCurrentPage] = useState("valid");
  return (
    <div className="main-container">
      <AdminNavbar />
      <div className="w-full py-5 flex justify-center">
        <button
          style={
            currentPage === "valid" ? { backgroundColor: "#3730a3" } : null
          }
          onClick={() => setCurrentPage("valid")}
          className="h-10 px-5 m-2 text-indigo-100 font-semibold transition-colors duration-150 bg-indigo-400 rounded-lg focus:shadow-outline hover:bg-indigo-500"
        >
          Requested Question List
        </button>

        <button
          style={
            currentPage === "invalid" ? { backgroundColor: "#3730a3" } : null
          }
          onClick={() => setCurrentPage("invalid")}
          className="h-10 px-5 m-2 text-indigo-100 font-semibold transition-colors duration-150 bg-indigo-400 rounded-lg focus:shadow-outline hover:bg-indigo-500"
        >
          Invalid Question List
        </button>
        <button
          style={
            currentPage === "answered" ? { backgroundColor: "#3730a3" } : null
          }
          onClick={() => setCurrentPage("answered")}
          className="h-10 px-5 m-2 text-indigo-100 font-semibold transition-colors duration-150 bg-indigo-400 rounded-lg focus:shadow-outline hover:bg-indigo-500"
        >
          Answered Question List
        </button>
      </div>
      {currentPage === "valid" && <AdminValidQuestion />}
      {currentPage === "invalid" && <AdminInvalidQuestion />}
      {currentPage === "answered" && <AdminAnsweredQuestions />}
    </div>
  );
};
export default AdminHome;

/**
 * itemClass="page-item" linkClass="page-link"
 */
