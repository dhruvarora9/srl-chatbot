import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

import {
  LOGIN_ADMIN,
  LOGIN_ADMIN_FAILED,
  LOGIN_ADMIN_SUCCESS,
  LOGOUT_ADMIN,
} from "../action-types/actionTypes";
import { auth } from "../firebase/app";
// import API from "../shared/API_EXPLICIT";

// export const setCustomUserClain = (uid) => {
//   getAuth()
//     .setCustomUserClaims(uid, { admin: true })
//     .then(() => {
//       console.log("admin priviledge set");
//     });
// };

export const adminLogin =
  (email, password, navigate, location) => (dispatch) => {
    dispatch({
      type: LOGIN_ADMIN,
    });
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        userCredentials.user
          .getIdTokenResult()
          .then((res) => {
            dispatch({
              type: LOGIN_ADMIN_SUCCESS,
              email: userCredentials.user.email,
              token: userCredentials.user.token,
              isAdmin: res.claims.admin ? true : false,
            });
            if (location.state?.from) navigate(location.state.from);
            // navigate(-1);
          })
          .catch((error) => console.log("Error"));
      })
      .catch((error) => {
        let errorMessage =
          "Error: " + error.message.match(/\(([^)]+)\)/)[1].split("/")[1];

        dispatch({
          type: LOGIN_ADMIN_FAILED,
          payload: errorMessage,
        });
      });
  };

export const setLoginStatus = (email, token, isAdmin) => (dispatch) => {
  dispatch({
    type: LOGIN_ADMIN_SUCCESS,
    email,
    token,
    isAdmin,
  });
};

export const logoutAdmin = () => (dispatch) => {
  signOut(auth)
    .then(() => {
      dispatch({
        type: LOGOUT_ADMIN,
      });
    })
    .catch((error) => console.log(error));
};
