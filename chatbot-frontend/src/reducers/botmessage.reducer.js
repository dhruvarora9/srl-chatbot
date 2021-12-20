import {
  SEND_BOT_MESSAGE,
  SEND_BOT_MESSAGE_FAILED,
  SEND_BOT_MESSAGE_SUCCESS,
} from "../action-types/actionTypes";

const initialState = {
  loading: false,
  messages: [
    {
      id: "f751efae-435d-4c91-95d7-9ecf98734d91",
      message: "Hi! This is SRL bot",
      type: "bot",
    },
    {
      id: "6a62d8e2-b5fb-45c1-b9a4-e8af4569758e",
      message: "Please type your question below",
      type: "bot",
    },
  ],
  message: "",
  error: null,
};

const botmessage = (state = initialState, action) => {
  switch (action.type) {
    case SEND_BOT_MESSAGE:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEND_BOT_MESSAGE_SUCCESS:
      console.log("success");
      return {
        ...state,
        loading: false,
        error: null,
        messages: action.payload,
      };
    case SEND_BOT_MESSAGE_FAILED:
      return {
        ...state,
        error: action.error,
        messages: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default botmessage;
