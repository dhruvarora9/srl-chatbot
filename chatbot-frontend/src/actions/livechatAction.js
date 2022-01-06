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
} from "../action-types/actionTypes";
import app from "../firebase/app";
const db = getDatabase(app);

export const checkRoomStatusCS =
  (roomId, csEmail, unsubscribeRef) => (dispatch) => {
    const dbRef = ref(db);
    let unsubscribe;
    get(child(dbRef, `roomInfo/room1`))
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
            console.log("cs can join again");
            dispatch(sendMessage(roomId));
            unsubscribe = dispatch(establishMessageConnectionCS(roomId));
          } else if (data.expired !== undefined && data.expired !== true) {
            // Connection needs to be established
            unsubscribe = dispatch(
              registerCSinChat(
                roomId,
                "customersupport1@gmail.com",
                data.userEmail
              )
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
  // const infoListRef = ref(db, "/roomInfo/room1");
  // const newPostRef = push(infoListRef);
  // set(newPostRef, {
  //   csEmail,
  // })
  //   .then((response) => {
  //     console.log("data saved successfully");
  //   })
  //   .catch((error) => {
  //     console.log("Failed to write data", error);
  //   });
  const updates = {};
  updates["/roomInfo/room1/"] = updateEmail;
  update(ref(db), updates)
    .then((response) => {
      console.log("data saved successfully");
      const unsubscribe = dispatch(createNewRoomInRoomsCollection(roomId));
      console.log(unsubscribe);
      return unsubscribe;
    })
    .catch((error) => {
      console.log("Failed to write data", error);
    });
};

export const sendMessage = (roomId) => (dispatch) => {
  //sending message
  const infoListRef = ref(db, "/rooms/room1");
  const newPostRef = push(infoListRef);
  set(newPostRef, {
    message: "Hi",
    sender: "user@gmail.com",
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
  set(ref(db, "rooms/room1/" + uuidv4()), messageBody).then(() => {
    console.log("room created successfully");
    return dispatch(establishMessageConnectionCS(roomId));
  });
};

export const establishMessageConnectionCS = (roomId) => (dispatch) => {
  const messageUpdateRef = ref(db, "rooms/room1");
  const unsubscribe = onValue(
    messageUpdateRef,
    (snapshot) => {
      const data = snapshot.val();
      console.log("ws connection established", data);

      dispatch({
        type: ROOM_VERIFY_SUCCESS,
        payload: data,
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
