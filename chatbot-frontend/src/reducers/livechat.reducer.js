import {
  CHECK_ROOM_STATUS_CS,
  LIVE_CHAT_FAILED,
  ROOM_VERIFY_SUCCESS,
  SET_FORM_STATUS,
  SET_SENDER_DETAILS,
} from "../action-types/actionTypes";

const initialState = {
  formStatus: false,
  loading: true,
  messageLoading: false,
  messages: [],
  roomId: null,
  error: null,
  senderName: "",
  senderEmail: "",
  messageError: null,
};

const livechat = (state = initialState, action) => {
  switch (action.type) {
    case SET_FORM_STATUS:
      return {
        ...state,
        formStatus: action.payload,
      };
    case SET_SENDER_DETAILS:
      return {
        ...state,
        senderEmail: action.senderEmail,
        senderName: action.senderName ? action.senderName : "",
        roomId: action.roomId ? action.roomId : null,
      };

    case ROOM_VERIFY_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: action.payload,
        error: null,
        roomId: action.roomId,
      };
    case LIVE_CHAT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default livechat;
