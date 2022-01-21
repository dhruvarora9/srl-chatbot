import {
  child,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import {
  LEAVE_ROOM_USER,
  LIVE_CHAT_FAILED,
  ROOM_VERIFY_SUCCESS,
  SEND_MESSAGE,
  SEND_MESSAGE_FAILED,
  SEND_MESSAGE_SUCCESS,
  SET_FORM_STATUS,
  SET_SENDER_DETAILS,
} from "../action-types/actionTypes";
import app from "../firebase/app";
import axios from "../shared/API_EXPLICIT";
import { stringContainHTMLHandler } from "../shared/Helper";
import { establishMessageConnectionCS } from "./livechatAction";
const db = getDatabase(app);

export const checkRoomStatusUser = (roomId, navigate) => (dispatch) => {
  const dbRef = ref(db);
  //flags
  const flag = JSON.parse(sessionStorage.getItem("flag"));
  const mailSent = JSON.parse(sessionStorage.getItem("MS"));
  //user details
  const senderEmail = sessionStorage.getItem("senderEmail");
  const senderName = sessionStorage.getItem("senderName");
  const senderMobileNo = sessionStorage.getItem("senderMobileNo");
  const ssRoomId = sessionStorage.getItem("roomId");

  console.log("check room status called ");
  if (flag !== undefined && roomId === ssRoomId) {
    get(child(dbRef, `roomInfo/` + roomId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log(data, flag, mailSent);
          if (
            !data.expired &&
            data.userEmail === senderEmail &&
            data.csEmail &&
            flag &&
            mailSent
          ) {
            console.log("reconnect the user");
            dispatch({
              type: SET_SENDER_DETAILS,
              senderName: senderName,
              senderEmail: senderEmail,
              senderMobileNo: senderMobileNo,
            });
            return dispatch(checkIfCSJoined(roomId, navigate));
          } else if (
            !data.expired &&
            data.userEmail === senderEmail &&
            !data.csEmail &&
            !flag &&
            mailSent
          ) {
            dispatch({
              type: SET_SENDER_DETAILS,
              senderName: senderName,
              senderEmail: senderEmail,
              senderMobileNo: senderMobileNo,
            });
            return dispatch(checkIfCSJoined(roomId, navigate));
          } else if (
            !data.expired &&
            data.userEmail === senderEmail &&
            !data.csEmail &&
            !flag &&
            !mailSent
          ) {
            console.log("resending the mail");
            return dispatch(
              sendMailToCSInitial(
                senderName,
                senderMobileNo,
                senderEmail,
                roomId,
                navigate
              )
            );
          } else {
            console.log("user: link has expired ");
            dispatch({
              type: LIVE_CHAT_FAILED,
              payload: "The chat link has expired!",
            });
          }
        } else {
          console.log("No Room exist for the following id");
        }
      })
      .catch((error) => {
        console.log("Error in checkroomstatususer :", error);
      });
  } else {
    console.log("user has not filled the form");
    dispatch({
      type: LIVE_CHAT_FAILED,
      payload: "User is not Authorized!",
    });
  }
};

export const createRoomLiveChatUser =
  (name, mobileNo, email, roomId, navigate) => (dispatch) => {
    sessionStorage.setItem("flag", false);
    sessionStorage.setItem("MS", false);
    set(ref(db, "roomInfo/" + roomId), {
      userName: name,
      userMobileNo: mobileNo,
      userEmail: email,
      expired: false,
    })
      .then((response) => {
        console.log("user: room created successfully", response);
        return dispatch(
          sendMailToCSInitial(name, mobileNo, email, roomId, navigate)
        );
      })
      .catch((error) => {
        console.log("Error creating room ", error);
      });
  };

export const sendMailToCSInitial =
  (name, mobileNo, email, roomId, navigate) => (dispatch) => {
    axios
      .post("/mailer", {
        roomId: roomId,
        user: name,
      })
      .then((resp) => {
        console.log("sent mail");
        sessionStorage.setItem("MS", true);
        dispatch({
          type: SET_SENDER_DETAILS,
          senderName: name,
          senderMobileNo: mobileNo,
          senderEmail: email,
          roomId: roomId,
        });
        return dispatch(checkIfCSJoined(roomId, navigate));
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: LIVE_CHAT_FAILED,
          payload: "There is some issue connection. Please refresh!",
        });
        // sessionStorage.removeItem("userEmail");
        // sessionStorage.removeItem("userName");
        // dispatch(deleteRoomFromRoomInfo(roomId));
        // dispatch({
        //   type: SET_FORM_STATUS,
        //   payload: false,
        // });
      });
  };

export const deleteRoomFromRoomInfo = (roomId) => (dispatch) => {
  remove(ref(db, "/roomInfo/" + roomId))
    .then(() => {
      console.log("room info removed successfully");
    })
    .catch((error) => console.log("Error while removing the room ifo", error));
};

//Check if Customer support has joined
export const checkIfCSJoined = (roomId, navigate) => (dispatch) => {
  const dataRef = ref(db, "roomInfo/" + roomId);
  const flag = sessionStorage.getItem("flag");

  const uns = onValue(dataRef, (snapshot) => {
    const value = snapshot.val();
    if (value.csEmail) {
      //CS has joined

      sessionStorage.setItem("flag", true);
      console.log("user: cs has joined");
      dispatch(checkRoomInfoStatusUser(roomId, navigate));
      uns();
      return dispatch(establishMessageConnectionCS(roomId));
    } else {
      console.log("waiting for cs to join");
      //CS has not joined till yet
    }
  });
};

//establishing a connection with the server

export const sendMessageUser =
  (divRef, roomId, message, sender) => (dispatch) => {
    const flag = sessionStorage.getItem("flag");
    if (!flag) {
      return dispatch({
        type: SEND_MESSAGE_FAILED,
        payload: "Failed to send your message.User not authorized",
      });
    }

    dispatch({
      type: SEND_MESSAGE,
    });
    const infoListRef = ref(db, "/rooms/" + roomId);
    const newPostRef = push(infoListRef);
    const updatedMessage = stringContainHTMLHandler(message);
    if (updatedMessage === "") {
      dispatch({
        type: SEND_MESSAGE_FAILED,
        payload: "Please enter a valid query",
      });
    } else {
      set(newPostRef, {
        message: message,
        sender: sender,
      })
        .then((response) => {
          console.log("message sent successfully");
          dispatch({
            type: SEND_MESSAGE_SUCCESS,
          });
          divRef?.current.scrollIntoView({ behavior: "smooth" });
        })
        .catch((error) => {
          console.log("Failed to write data", error);
          dispatch({
            type: SEND_MESSAGE_FAILED,
            payload:
              "Failed to send your message.Please try again or check your connection",
          });
        });
    }
  };

export const leaveLiveChatUser =
  (email, roomId, divRef, messages) => (dispatch) => {
    const updates = {};
    updates["/roomInfo/" + roomId + "/expired"] = true;
    update(ref(db), updates)
      .then((response) => {
        divRef?.current?.();
        dispatch(
          sendMessageUser(null, roomId, "The User has disconnected", email)
        );
        //send mail
        axios
          .post("/mailfordisconnecting", {
            senderEmail: email,
            messages,
            sender: "user",
            roomId,
          })
          .then(() => console.log("successfully sent mail for closing room"))
          .catch((error) =>
            console.log("Error sending mail for closing room ", error)
          );
      })
      .catch((error) => {
        console.log("Error setting expired ", error);
      });
  };

export const checkRoomInfoStatusUser = (roomId, navigate) => (dispatch) => {
  const dataRef = ref(db, "roomInfo/" + roomId);
  const uns = onValue(dataRef, (snapshot) => {
    const value = snapshot.val();
    if (value.expired) {
      console.log("expired set to true");

      sessionStorage.removeItem("senderEmail");
      sessionStorage.removeItem("senderName");
      sessionStorage.removeItem("senderMobileNo");
      sessionStorage.removeItem("MS");
      sessionStorage.removeItem("flag");
      sessionStorage.removeItem("roomId");
      dispatch({
        type: LEAVE_ROOM_USER,
        payload:
          "The chat has been closed!. You will be redirected to home page in 2 seconds...",
      });
      setTimeout(() => navigate("/", { replace: true }), 2000);
      uns();
    } else {
      console.log("checking status for expired...");
    }
  });
};
