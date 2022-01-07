import {
  CHECK_ROOM_STATUS_CS,
  LIVE_CHAT_FAILED,
  ROOM_VERIFY_SUCCESS,
} from "../action-types/actionTypes";

const initialState = {
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
