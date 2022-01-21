import { SEARCH_DATA } from "../action-types/actionTypes";
import axios from "../shared/API_EXPLICIT";
import { removeHTMLHandler } from "../shared/Helper";

export const getSearchData = (value) => (dispatch) => {
  console.log("action", value);
  let ques = removeHTMLHandler(value);

  axios
    .post("/searchdata", {
      query: ques,
    })
    .then((resp) => {
      dispatch({
        type: SEARCH_DATA,
        text: value,
        result: resp,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
