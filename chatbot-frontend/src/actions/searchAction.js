import { SEARCH_DATA } from "../action-types/actionTypes";
import axios from "../shared/API_EXPLICIT";
import { removeHTMLHandler } from "../shared/Helper";

export const getSearchData = (value) => (dispatch) => {
  console.log("action", value);
  let ques = removeHTMLHandler(value);
  
    axios.post("/searchdata", {
      query: ques
    })
    .then((resp) => {
     console.log('response in action',resp);
     dispatch({
      type: SEARCH_DATA,
      text : value,
      result : resp,
    });
    console.log('result action',resp.data)
    })
    .catch((error) => {
      console.log(error); 
    }) 
};