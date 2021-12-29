import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import Pagination from "react-js-pagination";
import "../adminhome.styles.css";
import { useDispatch, useSelector } from "react-redux";
import { getAnsweredQuestionList } from "../../../actions/adminAction";
import AdminViewModal from "../AdminViewModal/AdminViewModal";

function AdminAnsweredQuestions() {
  const { loading: adminLoading, answeredQuestionList } = useSelector(
    (store) => store.admin
  );
  const dispatch = useDispatch();
  const [itemsCountPerPage] = useState(5);
  const [activePage, setActivePage] = useState(1);
  const [pageRangeDisplayed] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const lastData = activePage * itemsCountPerPage;
  const firstData = lastData - itemsCountPerPage;

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewModalData, setViewModalData] = useState("");

  const showViewModalHandler = (id, query, response) => {
    setViewModalData({
      id,
      query,
      response,
    });
    setShowViewModal(true);
  };

  useEffect(() => {
    setTotalData(answeredQuestionList.length);
  }, [answeredQuestionList]);

  useEffect(() => {
    dispatch(getAnsweredQuestionList());
  }, []);

  return (
    <div>
      <div className="box-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Questiens</th>
              <th>Response List</th>
            </tr>
          </thead>
          <tbody>
            {answeredQuestionList &&
              answeredQuestionList.length > 0 &&
              answeredQuestionList
                .slice(firstData, lastData)
                .map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.query}</td>

                      <td>
                        <Button
                          variant="outline-primary"
                          onClick={() =>
                            showViewModalHandler(
                              data.id,
                              data.query,
                              data.response
                            )
                          }
                        >
                          View Response
                        </Button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </div>
      {showViewModal && (
        <AdminViewModal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          data={viewModalData}
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
}
export default AdminAnsweredQuestions;
