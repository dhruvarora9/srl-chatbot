import {
  SEND_BOT_MESSAGE,
  SEND_BOT_MESSAGE_FAILED,
  SEND_BOT_MESSAGE_SUCCESS,
} from "../action-types/actionTypes";
import API from "../shared/API_EXPLICIT";
import { v4 as uuidv4 } from "uuid";

export const Get_Bot_Message = (query, messagesList) => (dispatch) => {
  dispatch({
    type: SEND_BOT_MESSAGE,
  });
  let newMessgesList;
  API.post("/ansquery/find", { query: query })
    .then((res) => {
      if (res.data.status === 1) {
        newMessgesList = [
          ...messagesList,
          { id: uuidv4(), message: query, type: "user" },
          {
            id: uuidv4(),
            message: res.data.responseData,
            type: "bot",
          },
        ];
        dispatch({
          type: SEND_BOT_MESSAGE_SUCCESS,
          payload: newMessgesList,
        });
      }
    })
    .catch((error) => {
      newMessgesList = [
        ...messagesList,
        {
          id: uuidv4(),
          message: query,
          type: "user",
        },
        {
          id: uuidv4(),
          message: "No results found. Please try again with another keyword!",
          type: "bot",
        },
      ];
      dispatch({
        type: SEND_BOT_MESSAGE_FAILED,
        payload: newMessgesList,
        error: error.message,
      });
    });
};
