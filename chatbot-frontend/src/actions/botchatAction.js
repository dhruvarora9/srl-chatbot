import {
  SEND_BOT_MESSAGE,
  SEND_BOT_MESSAGE_FAILED,
  SEND_BOT_MESSAGE_SUCCESS,
} from "../action-types/actionTypes";
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
import {
  removeHTMLHandler,
  stringContainHTMLHandler,
  stringDecoderHandler,
  stringEncoderHandler,
  toLowerCaseConverter,
} from "../shared/Helper";

export const Get_Bot_Message =
  (divRef, ques, messagesList, messageId) => (dispatch) => {
    // divRef: reference to last message,
    // messageId: message id for bubble to flag it true

    dispatch({
      type: SEND_BOT_MESSAGE,
    });
    let updatedQues = stringEncoderHandler(toLowerCaseConverter(ques));
    let newMessageList;
    let updatedMessageList = messagesList.map((item) => {
      if (item.id === messageId) {
        return {
          ...item,
          flag: true,
        };
      }
      return item;
    });
    // if (updatedQues.length === 0) {
    //   newMessageList = [
    //     ...updatedMessageList,

    //     {
    //       id: uuidv4(),
    //       message: "Please Enter a valid query",
    //     },
    //   ];
    //   dispatch({
    //     type: SEND_BOT_MESSAGE_FAILED,
    //     payload: newMessageList,
    //     error: "error",
    //   });
    //   divRef.current.scrollIntoView({ behavior: "smooth" });
    //   return;
    // }

    const q = query(
      collection(db, "botchat"),
      where("query", "==", updatedQues)
    );

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
              ...updatedMessageList,
              {
                id: uuidv4(),
                message: stringDecoderHandler(updatedQues),
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
            divRef.current.scrollIntoView({ behavior: "smooth" });
          })
          .catch((error) => console.log(error));
      } else {
        // Result found in db
        let messageArray = [];
        querySnapshot.forEach((querySnapshotItem) => {
          let responseData = querySnapshotItem.data();
          if (
            Array.isArray(responseData.response) &&
            !responseData.multiresponse
          ) {
            //Result is an array (for multiple response bubble)
            responseData.response.forEach((respItem) => {
              messageArray.push({
                id: uuidv4(),
                firebase_id: respItem.firebase_id,
                message: respItem.query,
              });
            });
            newMessageList = [
              ...updatedMessageList,
              {
                id: uuidv4(),
                message: stringDecoderHandler(updatedQues),
                sender: "user",
              },
              {
                id: uuidv4(),
                message: "Here are a few suggestions",
              },
              {
                id: uuidv4(),
                flag: false,
                message: messageArray,
              },
            ];
          } else if (
            Array.isArray(responseData.response) &&
            responseData.multiresponse
          ) {
            // result is an array(for multiple response )
            const selectedMessage =
              responseData.response[
                Math.floor(Math.random() * responseData.response.length)
              ];
            newMessageList = [
              ...updatedMessageList,
              {
                id: uuidv4(),
                message: stringDecoderHandler(updatedQues),
                sender: "user",
              },
              {
                id: uuidv4(),
                firebase_id: querySnapshotItem.id,
                message: selectedMessage.response,
              },
            ];
          } else {
            // Result is not an array
            if (querySnapshotItem.data().type) {
              // Result not an array and type true
              newMessageList = [
                ...updatedMessageList,
                {
                  id: uuidv4(),
                  message: stringDecoderHandler(updatedQues),
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
                ...updatedMessageList,
                {
                  id: uuidv4(),
                  message: stringDecoderHandler(updatedQues),
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
        divRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

export const getChatBubbleMessage =
  (divRef, id, ques, messagesList, messageId) => (dispatch) => {
    let newMessageList = [];
    let updatedMessageList = messagesList.map((item) => {
      if (item.id === messageId) {
        return {
          ...item,
          flag: true,
        };
      }
      return item;
    });

    getDoc(doc(db, "botchat", id)).then((doc) => {
      if (Array.isArray(doc.data().response) && !doc.data().multiresponse) {
        //Result is an array (for multiple bubble response)
        let messageArray = [];
        doc.data().response.forEach((respItem) => {
          messageArray.push({
            id: uuidv4(),
            firebase_id: respItem.firebase_id,
            message: respItem.query,
          });
        });
        newMessageList = [
          ...updatedMessageList,
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
            flag: false,
            message: messageArray,
          },
        ];
      } else if (
        Array.isArray(doc.data().response) &&
        doc.data().multiresponse
      ) {
        //Result is an array (for multiple response)
        let selectedMessage =
          doc.data().response[
            Math.floor(Math.random() * doc.data().response.length)
          ];

        newMessageList = [
          ...updatedMessageList,
          {
            id: uuidv4(),
            message: ques,
            sender: "user",
          },
          {
            id: uuidv4(),
            firebase_id: selectedMessage.id,
            message: selectedMessage.response,
          },
        ];
      } else {
        // Result is not an array

        newMessageList = [
          ...updatedMessageList,
          {
            id: uuidv4(),
            message: ques,
            sender: "user",
          },
          {
            id: uuidv4(),
            firebase_id: doc.id,
            message: doc.data().response,
          },
        ];
      }
      dispatch({
        type: SEND_BOT_MESSAGE_SUCCESS,
        payload: newMessageList,
      });
      divRef.current.scrollIntoView({ behavior: "smooth" });
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
