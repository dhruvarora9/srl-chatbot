import {
  SEND_BOT_MESSAGE,
  SEND_BOT_MESSAGE_FAILED,
  SEND_BOT_MESSAGE_SUCCESS,
} from "../action-types/actionTypes";
import API from "../shared/API_EXPLICIT";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase/app";
import { toLowerCaseConverter } from "../shared/Helper";

export const Get_Bot_Message = (ques, messagesList) => (dispatch) => {
  dispatch({
    type: SEND_BOT_MESSAGE,
  });
  let updatedQues = toLowerCaseConverter(ques);
  const q = query(collection(db, "botchat"), where("query", "==", updatedQues));
  let newMessageList;
  getDocs(q).then((querySnapshot) => {
    if (querySnapshot.empty) {
      // No result found in db
      // Add the unanswered question to db
      addDoc(collection(db, "botchat"), {
        query: updatedQues,
        response: "",
        type: false,
        valid: true,
      })
        .then((res) => {
          newMessageList = [
            ...messagesList,
            {
              id: uuidv4(),
              message: ques,
              sender: "user",
            },
            {
              id: uuidv4(),
              message:
                "No results found. Please try again with another keyword!",
            },
          ];
          dispatch({
            type: SEND_BOT_MESSAGE_FAILED,
            payload: newMessageList,
            error: "error",
          });
        })
        .catch((error) => console.log(error));
    } else {
      // Result found in db
      let messageArray = [];
      querySnapshot.forEach((querySnapshotItem) => {
        if (Array.isArray(querySnapshotItem.data().response)) {
          //Result is an array (for multiple response)
          querySnapshotItem.data().response.forEach((respItem) => {
            messageArray.push({
              id: uuidv4(),
              firebase_id: respItem.reference.id,
              message: respItem.query,
            });
          });
          newMessageList = [
            ...messagesList,
            {
              id: uuidv4(),
              message: ques,
              sender: "user",
            },
            {
              id: uuidv4(),
              message: "Here are a few suggestions",
            },
            {
              id: uuidv4(),
              message: messageArray,
            },
          ];
        } else {
          // Result is not an array
          if (querySnapshotItem.data().type) {
            // Result not an array and type true
            newMessageList = [
              ...messagesList,
              {
                id: uuidv4(),
                message: ques,
                sender: "user",
              },
              {
                id: uuidv4(),
                firebase_id: querySnapshotItem.id,
                message: querySnapshotItem.data().response,
              },
            ];
          } else {
            // Result not an array and type false
            newMessageList = [
              ...messagesList,
              {
                id: uuidv4(),
                message: ques,
                sender: "user",
              },
              {
                id: uuidv4(),
                message:
                  "No results found. Please try again with another keyword!",
              },
            ];
          }
        }
      });
      dispatch({
        type: SEND_BOT_MESSAGE_SUCCESS,
        payload: newMessageList,
      });
    }
  });
};

export const getAllBotMessages = () => (dispatch) => {
  getDocs(collection(db, "botchat"))
    .then((response) => {
      response.forEach((newres) => {
        if (Array.isArray(newres.data().response)) {
          let promise = newres
            .data()
            .response.map((item) => getDoc(doc(db, "botchat", item.id)));
          Promise.all(promise)
            .then((res) => {
              res.forEach((promiseResult) => console.log(promiseResult.data()));
            })
            .catch((error) => console.log(error.message));
        } else {
          console.log(newres.data());
        }
      });
    })
    .catch((error) => console.log(error));
};
