import { combineReducers } from "redux";
import botmessage from "./botmessage.reducer";
import auth from "./auth.reducer";
import quesData from "./quesData.reducer";

const reducers = combineReducers({
  botmessage,
  auth,
  quesData,
});

export default reducers;
