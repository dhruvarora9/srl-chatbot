import uniqueId from "lodash.uniqueid";
import { useNavigate } from "react-router-dom";
import {
  LOGIN_ADMIN,
  LOGIN_ADMIN_FAILED,
  LOGIN_ADMIN_SUCCESS,
  LOGOUT_ADMIN,
} from "../action-types/actionTypes";
import API from "../shared/API_EXPLICIT";

export const adminLogin = (email, password, navigate) => (dispatch) => {
  dispatch({
    type: LOGIN_ADMIN,
  });
  API.post("/admin/login", {
    email: email,
    password: password,
  })
    .then((res) => {
      localStorage.setItem("email", res.data.admin.email);
      localStorage.setItem("username", res.data.admin.username);
      localStorage.setItem("token", res.data.token);
      dispatch({
        type: LOGIN_ADMIN_SUCCESS,
        email: res.data.admin.email,
        username: res.data.admin.username,
        token: res.data.token,
      });
      navigate("/dashboard", { replace: true });
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: LOGIN_ADMIN_FAILED,
        payload: error,
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

export const logoutAdmin = () => (dispatch) => {
  localStorage.removeItem("email");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  dispatch({
    type: LOGOUT_ADMIN,
  });
};
