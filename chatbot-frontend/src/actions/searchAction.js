import { SEARCH_DATA } from "../action-types/actionTypes";
import axios from "../shared/API_EXPLICIT";

export const getSearchData = (value) => (dispatch) => {
  console.log("action", value);

    axios.post("/searchdata", {
      query: value
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