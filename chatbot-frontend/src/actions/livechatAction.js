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
const db = getDatabase(app);

export const checkRoomStatusCS =
  (roomId, csEmail, unsubscribeRef) => (dispatch) => {
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
            data.csEmail === csEmail
          ) {
            console.log("(cs can join again)");
            // Temporary for expiring chat on reload
            // dispatch({
            //   type: LIVE_CHAT_FAILED,
            //   payload: "The chat has expired!",
            // });
            // dispatch(sendMessage(roomId));
            dispatch({
              type: SET_SENDER_DETAILS,
              senderName: "customer support",
              senderEmail: data.csEmail,
            });
            unsubscribe = dispatch(establishMessageConnectionCS(roomId));
          } else if (data.expired !== undefined && data.expired !== true) {
            // Connection needs to be established
            unsubscribe = dispatch(
              registerCSinChat(roomId, csEmail, data.userEmail)
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

export const checkRoomStatusUser = (roomId) => (dispatch) => {
  const dbRef = ref(db);
  const senderEmail = sessionStorage.getItem("userEmail");
  const senderName = sessionStorage.getItem("userName");
  console.log("check room status called ");
  if (senderEmail) {
    get(child(dbRef, `roomInfo/` + roomId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (!data.expired && data.userEmail === senderEmail && data.csEmail) {
            console.log("reconnect the user");
            dispatch({
              type: SET_SENDER_DETAILS,
              senderName: senderName,
              senderEmail: senderEmail,
            });
            return dispatch(checkIfCSJoined(roomId));
          } else if (
            !data.expired &&
            data.userEmail === senderEmail &&
            !data.csEmail
          ) {
            dispatch({
              type: LIVE_CHAT_FAILED,
              payload: "There is some issue connection. Please refresh!",
            });
            sessionStorage.removeItem("userEmail");
            sessionStorage.removeItem("userName");
            dispatch(deleteRoomFromRoomInfo(roomId));
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

export const deleteRoomFromRoomInfo = (roomId) => (dispatch) => {
  remove(ref(db, "/roomInfo/" + roomId))
    .then(() => {
      console.log("room info removed successfully");
    })
    .catch((error) => console.log("Error while removing the room ifo", error));
};

export const registerCSinChat = (roomId, csEmail, userEmail) => (dispatch) => {
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
      const unsubscribe = dispatch(
        createNewRoomInRoomsCollection(roomId, csEmail)
      );

      return unsubscribe;
    })
    .catch((error) => {
      console.log("Failed to write data", error);
    });
};

export const sendMessage = (divRef, roomId, message, sender) => (dispatch) => {
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
        return dispatch(establishMessageConnectionCS(roomId));
      })
      .catch((error) => {
        console.log("Failed to write data", error);
      });
  };

//establishing a connection with the server
export const establishMessageConnectionCS = (roomId) => (dispatch) => {
  const messageUpdateRef = ref(db, "rooms/" + roomId);
  const unsubscribe = onValue(
    messageUpdateRef,
    (snapshot) => {
      const data = snapshot.val();
      console.log("ws connection established", data);
      let messageArray = [];
      if (data) {
        messageArray = Object.keys(data).map((id) => {
          return {
            id: id,
            message: data[id].message,
            sender: data[id].sender,
          };
        });
      }

      dispatch({
        type: ROOM_VERIFY_SUCCESS,
        payload: messageArray,
        roomId: roomId,
      });
    },
    (error) => {
      console.log(
        "Error occured in establishing connection with the message list ",
        error
      );
    }
  );
  return unsubscribe;
};

//create room from user side
export const createRoomLiveChatUser = (name, email, roomId) => (dispatch) => {
  set(ref(db, "roomInfo/" + roomId), {
    userName: name,
    userEmail: email,
    expired: false,
  }).then((response) => {
    console.log("user: room created successfully");
    axios
      .post("/mailer", {
        roomId: roomId,
        user: name,
      })
      .then((resp) => {
        console.log("sent mail");
        dispatch({
          type: SET_SENDER_DETAILS,
          senderName: name,
          senderEmail: email,
          roomId: roomId,
        });
        return dispatch(checkIfCSJoined(roomId));
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: LIVE_CHAT_FAILED,
          payload: "There is some issue connection. Please refresh!",
        });
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("userName");
        dispatch(deleteRoomFromRoomInfo(roomId));
        dispatch({
          type: SET_FORM_STATUS,
          payload: false,
        });
      });
  });
};

//Check if Customer support has joined
export const checkIfCSJoined = (roomId) => (dispatch) => {
  const dataRef = ref(db, "roomInfo/" + roomId);
  const uns = onValue(dataRef, (snapshot) => {
    const value = snapshot.val();
    if (value.csEmail) {
      //CS has joined
      console.log("user: cs has joined");
      uns();
      return dispatch(establishMessageConnectionCS(roomId));
    } else {
      console.log("waiting for cs to join");
      //CS has not joined till yet
    }
  });
};
