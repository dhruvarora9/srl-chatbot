import { combineReducers } from "redux";
import botmessage from "./botmessage.reducer";
import auth from "./auth.reducer";
import quesData from "./quesData.reducer";
import admin from "./admin.reducer";

const reducers = combineReducers({
  botmessage,
  auth,
  quesData,
  admin,
});

export default reducers;
