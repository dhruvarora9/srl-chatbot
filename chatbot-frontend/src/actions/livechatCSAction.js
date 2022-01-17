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
  LEAVE_ROOM_CS,
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

export const checkRoomStatusCS =
  (navigate, roomId, csEmail, unsubscribeRef) => (dispatch) => {
    const csFlag = sessionStorage.getItem("csFlag");
    const dbRef = ref(db);
    let unsubscribe;
    get(child(dbRef, `roomInfo/` + roomId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          if (!data.expired && data.csEmail && data.csEmail !== csEmail) {
            console.log("already connection is established");
            dispatch({
              type: LIVE_CHAT_FAILED,
              payload: "Connection already established! ",
            });
          } else if (
            !data.expired &&
            data.csEmail &&
            data.csEmail === csEmail &&
            csFlag
          ) {
            console.log("(cs can join again)");
            dispatch({
              type: SET_SENDER_DETAILS,
              senderName: "customer support",
              senderEmail: data.csEmail,
            });
            dispatch(checkRoomInfoStatusCS(roomId, navigate));
            unsubscribe = dispatch(establishMessageConnectionCS(roomId));
          } else if (
            data.expired !== undefined &&
            data.expired !== true &&
            !data.csEmail
          ) {
            // Connection needs to be established
            sessionStorage.setItem("csFlag", false);
            unsubscribe = dispatch(
              registerCSinChat(roomId, csEmail, data.userEmail, navigate)
            );
            dispatch({
              type: SET_SENDER_DETAILS,
              senderName: "customer support",
              senderEmail: csEmail,
            });
          } else {
            console.log("chat has expired");
            dispatch({
              type: LIVE_CHAT_FAILED,
              payload: "The chat has expired!",
            });
          }
        } else {
          console.log("no data evailable");
        }
        unsubscribeRef.current = unsubscribe;
      })
      .catch((error) => console.log(error));
  };

export const registerCSinChat =
  (roomId, csEmail, userEmail, navigate) => (dispatch) => {
    var updateEmail = {
      csEmail,
      expired: false,
      userEmail,
    };
    const updates = {};
    updates["/roomInfo/" + roomId] = updateEmail;
    update(ref(db), updates)
      .then((response) => {
        console.log("data saved successfully");
        dispatch(checkRoomInfoStatusCS(roomId, navigate));
        const unsubscribe = dispatch(
          createNewRoomInRoomsCollection(roomId, csEmail)
        );

        return unsubscribe;
      })
      .catch((error) => {
        console.log("Failed to write data", error);
      });
  };

export const createNewRoomInRoomsCollection =
  (roomId, csEmail) => (dispatch) => {
    //Intializing room for chatting when cs is registered
    const messageBody = {
      message: "This is a test message",
      sender: csEmail,
    };
    const infoListRef = ref(db, "/rooms/" + roomId);
    const newPostRef = push(infoListRef);
    set(newPostRef, messageBody)
      .then((response) => {
        console.log("room created successfully");
        sessionStorage.setItem("csFlag", true);
        return dispatch(establishMessageConnectionCS(roomId));
      })
      .catch((error) => {
        console.log("Failed to write data", error);
      });
  };

export const sendMessageCS =
  (divRef, roomId, message, sender) => (dispatch) => {
    const flag = sessionStorage.getItem("csFlag");
    if (!flag) {
      console.log("flag called");
      return dispatch({
        type: SEND_MESSAGE_FAILED,
        payload:
          "Failed to send your message.Please try again or check your connection",
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
          divRef.current.scrollIntoView({ behavior: "smooth" });
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

export const leaveLiveChatCS = (email, roomId, divRef) => (dispatch) => {
  const updates = {};
  updates["/roomInfo/" + roomId + "/expired"] = true;
  update(ref(db), updates)
    .then((response) => {
      divRef?.current?.();
      dispatch(
        sendMessageCS(
          null,
          roomId,
          "The Customer Support has disconnected",
          email
        )
      );
    })
    .catch((error) => {
      console.log("Error setting expired ", error);
    });
};

export const checkRoomInfoStatusCS = (roomId, navigate) => (dispatch) => {
  const dataRef = ref(db, "roomInfo/" + roomId);
  const uns = onValue(dataRef, (snapshot) => {
    const value = snapshot.val();
    if (value.expired) {
      console.log("expired set to true");
      sessionStorage.removeItem("csFlag");
      dispatch({
        type: LEAVE_ROOM_CS,
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
