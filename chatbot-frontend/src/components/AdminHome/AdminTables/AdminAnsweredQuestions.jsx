import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import Pagination from "react-js-pagination";
import "../adminhome.styles.css";
import { useDispatch, useSelector } from "react-redux";
import { getAnsweredQuestionList } from "../../../actions/adminAction";

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
              <th>First Response</th>
              <th>Second Response</th>
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
                      { 
                      (Array.isArray(data.response)) &&
                        data.response.map((item, ind) => {
                          return(
                            <td key={ind}>{item.query}</td>
                          );
                        })
                     } 
                      {data.response.length > 2 && <td>{data.response}</td>}
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </div>
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