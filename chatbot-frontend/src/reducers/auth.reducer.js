import {
  LOGIN_ADMIN,
  LOGIN_ADMIN_FAILED,
  LOGIN_ADMIN_SUCCESS,
  LOGOUT_ADMIN,
} from "../action-types/actionTypes";

const initialState = {
  username: null,
  error: null,
  loading: false,
  email: null,
  token: null,
  isAdmin: false,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_ADMIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        token: action.token,
        email: action.email,
        isAdmin: action.isAdmin,
      };
    case LOGIN_ADMIN_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        token: null,
        email: null,
        isAdmin: false,
      };
    case LOGOUT_ADMIN:
      return {
        ...state,
        loading: false,
        error: null,
        token: null,
        email: null,
        isAdmin: false,
      };
    default:
      return state;
  }
};

export default auth;
