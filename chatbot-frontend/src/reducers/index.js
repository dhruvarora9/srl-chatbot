import { combineReducers } from "redux";
import botmessage from "./botmessage.reducer";
import auth from "./auth.reducer";
import quesData from "./quesData.reducer";
import admin from "./admin.reducer";
import livechat from "./livechat.reducer";

const reducers = combineReducers({
  botmessage,
  auth,
  quesData,
  admin,
  livechat,
});

export default reducers;
