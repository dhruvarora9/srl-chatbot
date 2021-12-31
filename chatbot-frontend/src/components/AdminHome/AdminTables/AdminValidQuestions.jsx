import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import "../adminhome.styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getValidQuestionList,
  editValidQuestion,
} from "../../../actions/adminAction";
import AdminResponseModal from "../../AdminResponseModal/AdminResponseModal";

const AdminValidQuestion = (props) => {

  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseModalData, setResponseModalData] = useState("");
  const { validQuestionList } = useSelector(
    (store) => store.admin
  );
  const dispatch = useDispatch();
  const [itemsCountPerPage] = useState(5);
  const [activePage, setActivePage] = useState(1);
  const [pageRangeDisplayed] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const lastData = activePage * itemsCountPerPage;
  const firstData = lastData - itemsCountPerPage;

  const handleInvalidate = (id) => {
    dispatch(editValidQuestion(id));
    toast.success("question has been invalidated");
  };

  const showResponseModalHandler = (id, query, firebase_id) => {
    setResponseModalData({
      id,
      query,
      firebase_id,
    });
    setShowResponseModal(true);
  };

  useEffect(() => {
    setTotalData(validQuestionList.length);
  }, [validQuestionList]);

  useEffect(() => {
    dispatch(getValidQuestionList());
  }, [dispatch]);

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
            {validQuestionList &&
              validQuestionList.length > 0 &&
              validQuestionList
                .slice(firstData, lastData)
                .map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.query}</td>
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
                          onClick={() =>
                            showResponseModalHandler(
                              data.id,
                              data.query,
                              data.firebase_id
                            )
                          }
                        >
                          Add Response
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleInvalidate(data.firebase_id)}
                        >
                          Invalidate
                        </Button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </div>
      {showResponseModal && (
        <AdminResponseModal
          show={showResponseModal}
          onHide={() => setShowResponseModal(false)}
          data={responseModalData}
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
export default AdminValidQuestion;
