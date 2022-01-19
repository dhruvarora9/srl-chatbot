import { SEARCH_DATA } from "../action-types/actionTypes";

const initialState = {
  searchedValue : "",
  searchedReasult: "",
}

const searchpage = (state = initialState, action) => {
    switch (action.type) {
      case SEARCH_DATA:
        return {
          ...state,
          searchedValue: action.text,
          searchedReasult: action.result,
        };
      default:
        return state;
    }
};
export default searchpage;