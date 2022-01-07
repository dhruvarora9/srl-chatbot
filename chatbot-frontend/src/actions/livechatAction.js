import {
  child,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import {
  LIVE_CHAT_FAILED,
  ROOM_VERIFY_SUCCESS,
  SEND_MESSAGE,
} from "../action-types/actionTypes";
import app from "../firebase/app";
import axios from "../shared/API_EXPLICIT";
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
            // already connection is established
            console.log("already connection is established");
            dispatch({
              type: LIVE_CHAT_FAILED,
              payload: "Connection already established!",
            });
          } else if (
            !data.expired &&
            data.csEmail &&
            data.csEmail === csEmail
          ) {
            // cs executive can join again
            console.log(
              "Temporary for expiring chat on reload (cs can join again)"
            );
            // Temporary for expiring chat on reload
            dispatch({
              type: LIVE_CHAT_FAILED,
              payload: "The chat has expired!",
            });
            // dispatch(sendMessage(roomId));
            // unsubscribe = dispatch(establishMessageConnectionCS(roomId));
          } else if (data.expired !== undefined && data.expired !== true) {
            // Connection needs to be established
            unsubscribe = dispatch(
              registerCSinChat(roomId, csEmail, data.userEmail)
            );
          } else {
            // If chat has expired
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
      const unsubscribe = dispatch(createNewRoomInRoomsCollection(roomId));

      return unsubscribe;
    })
    .catch((error) => {
      console.log("Failed to write data", error);
    });
};

export const sendMessage = (roomId, message, sender) => (dispatch) => {
  //sending message
  dispatch({
    type: SEND_MESSAGE,
  });
  const infoListRef = ref(db, "/rooms/" + roomId);
  const newPostRef = push(infoListRef);
  set(newPostRef, {
    message: message,
    sender: sender,
  })
    .then((response) => {
      console.log("message sent successfully");
    })
    .catch((error) => {
      console.log("Failed to write data", error);
    });
};

export const createNewRoomInRoomsCollection = (roomId) => (dispatch) => {
  //Intializing room for chatting when cs is registered
  const messageBody = {
    message: "This is a test message",
    sender: "customersupport1@gmail.com",
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

export const establishMessageConnectionCS = (roomId) => (dispatch) => {
  const messageUpdateRef = ref(db, "rooms/" + roomId);
  const unsubscribe = onValue(
    messageUpdateRef,
    (snapshot) => {
      const data = snapshot.val();
      console.log("ws connection established", data);
      let messageArray = Object.keys(data).map((id) => {
        return {
          id: id,
          message: data[id].message,
          sender: data[id].sender,
        };
      });
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
        return dispatch(checkIfCSJoined(roomId));
      })
      .catch((error) => console.log(error));
  });
  let arr = [];
};

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
      //CS has not joined till yet
    }
  });
};
