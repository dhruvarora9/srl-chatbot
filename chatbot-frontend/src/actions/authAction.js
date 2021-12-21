import { signInWithEmailAndPassword } from "firebase/auth";

import {
  LOGIN_ADMIN,
  LOGIN_ADMIN_FAILED,
  LOGIN_ADMIN_SUCCESS,
  LOGOUT_ADMIN,
} from "../action-types/actionTypes";
import { auth } from "../firebase/app";
// import API from "../shared/API_EXPLICIT";

export const adminLogin = (email, password, navigate) => (dispatch) => {
  dispatch({
    type: LOGIN_ADMIN,
  });

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      localStorage.setItem("token", userCredentials.user.accessToken);
      localStorage.setItem("email", userCredentials.user.email);
      localStorage.setItem("username", "Admin");
      dispatch({
        type: LOGIN_ADMIN_SUCCESS,
        email: userCredentials.user.email,
        token: userCredentials.user.email,
        username: "Admin",
      });
    })
    .catch((error) => {
      console.log("error code", error.code, "Error Message: ", error.message);
      dispatch({
        type: LOGIN_ADMIN_FAILED,
        payload: error.message,
      });
    });
};

export const checkLoginStatus = () => (dispatch) => {
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username");
  let email = localStorage.getItem("email");
  if (token) {
    dispatch({
      type: LOGIN_ADMIN_SUCCESS,
      email,
      username,
      token,
    });
  }
};

export const setLoginStatus = (email, token, username) => (dispatch) => {
  dispatch({
    type: LOGIN_ADMIN_SUCCESS,
    email,
    username,
    token,
  });
};

export const logoutAdmin = () => (dispatch) => {
  localStorage.removeItem("email");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  dispatch({
    type: LOGOUT_ADMIN,
  });
};
