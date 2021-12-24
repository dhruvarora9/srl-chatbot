import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/app";
import "../adminhome.styles.css";
import AdminResponse from "../AdminResponse";
import { useDispatch, useSelector } from "react-redux";
import { getInvalidQuestionList } from "../../../actions/adminAction";

const AdminInvalidQuestion = (props) => {
  const { editModal, setEditModal } = props;
  const usersCollectionRef = collection(db, "userquery");

  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseModalData, setResponseModalData] = useState("");
  const { loading: adminLoading, invalidQuestionList } = useSelector(
    (store) => store.admin
  );
  const dispatch = useDispatch();
  const [itemsCountPerPage] = useState(5);
  const [activePage, setActivePage] = useState(1);
  const [pageRangeDisplayed] = useState(5);
  const [totalData, setTotalData] = useState(0);
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
    dispatch(getInvalidQuestionList());
  }, []);

  useEffect(() => {
    setTotalData(invalidQuestionList.length);
  }, [invalidQuestionList]);

  return (
    <div>
      <div className="box-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Questiens</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invalidQuestionList &&
              invalidQuestionList.length > 0 &&
              invalidQuestionList
                .slice(firstData, lastData)
                .map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.query}</td>
                      <td>
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
export default AdminInvalidQuestion;
