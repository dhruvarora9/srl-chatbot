import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import "../admin-home/adminhome.styles.css";
import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminResponse from "./AdminResponse";

const AdminHome = (props) => {
  const { editModal, setEditModal } = props;
  console.log("editModal home", editModal);
  const dispatch = useDispatch();
  const unansweredQuesList = useSelector((store) => store.quesData.quesList);

  const [itemsCountPerPage, setItemsCountPerPage] = useState(5);
  const [activePage, setActivePage] = useState(1);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseModalData, setResponseModalData] = useState("");

  const lastData = activePage * itemsCountPerPage;
  const firstData = lastData - itemsCountPerPage;

  const handleDelete = () => {
    toast.success("question has been deleted");
  };

  const showResponseModalHandler = (id) => {
    setResponseModalData(id);
    setShowResponseModal(true);
  };

  useEffect(() => {
    setTotalData(unansweredQuesList.length);
    console.log("activepage", activePage);
  }, [activePage]);

  return (
    <div className="main-container">
      <AdminNavbar />
      <div className="box-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Questiens</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unansweredQuesList &&
              unansweredQuesList.length > 0 &&
              unansweredQuesList
                .slice(firstData, lastData)
                .map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.id}</td>
                      <td>{data.text}</td>
                      <td>
                        {/* <Link
                        className="btn btn-primary "
                        role="button"
                        to={`/adminResponse/${data.id}`}
                      >
                        Add Response
                      </Link> */}
                        <Button
                          variant="outline-primary"
                          onClick={() => showResponseModalHandler(data.id)}
                        >
                          Add Response
                        </Button>
                      </td>
                      <td>
                        <Button variant="outline-danger" onClick={handleDelete}>
                          Delete Question
                        </Button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </div>
      {showResponseModal && (
        <AdminResponse
          show={showResponseModal}
          onHide={setShowResponseModal}
          id={responseModalData}
        />
      )}
      {console.log("editModal after click", editModal)}
      {totalData > itemsCountPerPage ? (
        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemsCountPerPage}
          totalItemsCount={totalData}
          pageRangeDisplayed={pageRangeDisplayed}
          onChange={(currentPage) => setActivePage(currentPage)}
        />
      ) : (
        " "
      )}
    </div>
  );
};
export default AdminHome;

/**
 * itemClass="page-item" linkClass="page-link"
 */
