import {
  CHECK_ROOM_STATUS_CS,
  LEAVE_ROOM_CS,
  LEAVE_ROOM_USER,
  LIVE_CHAT_FAILED,
  ROOM_VERIFY_SUCCESS,
  SEND_MESSAGE,
  SEND_MESSAGE_FAILED,
  SEND_MESSAGE_SUCCESS,
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
  senderMobileNo: "",
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
        loading: true,
        error: null,
        senderEmail: action.senderEmail,
        senderMobileNo: action.senderMobileNo,
        senderName: action.senderName ? action.senderName : "",
        roomId: action.roomId ? action.roomId : null,
      };
    case SEND_MESSAGE:
      return {
        ...state,
        messageLoading: true,
        messageError: null,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messageLoading: false,
        messageError: null,
      };
    case SEND_MESSAGE_FAILED: {
      return {
        ...state,
        messageLoading: false,
        messageError: action.payload,
      };
    }

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
    case LEAVE_ROOM_USER:
      return {
        ...state,
        roomId: null,
        error: action.payload,
        senderName: "",
        senderEmail: "",
        senderMobileNo: "",
      };
    case LEAVE_ROOM_CS:
      return {
        ...state,
        senderName: "",
        senderEmail: "",
        roomId: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default livechat;
