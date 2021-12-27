import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import {
  GET_ADMIN_INVALID_QUESTIONS,
  GET_ADMIN_VALID_QUESTIONS,
  EDIT_ADMIN_VALID_QUESTIONS,
  EDIT_ADMIN_INVALID_QUESTIONS,

} from "../action-types/actionTypes";
import { db } from "../firebase/app";
import { v4 as uuidv4 } from "uuid";

export const getValidQuestionList = () => (dispatch) => {
  const usersCollectionRef = collection(db, "botchat");
  const getUsers = async () => {
    const filteredData = query(
      usersCollectionRef,
      where("type", "==", false),
      where("valid", "==", true)
    );
    let arr = [];
    const querySnapshot = await getDocs(filteredData);
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), firebase_id: doc.id, id: uuidv4() });
    });
    dispatch({
      type: GET_ADMIN_VALID_QUESTIONS,
      payload: arr,
    });
  };
  getUsers();
};

export const getInvalidQuestionList = () => (dispatch) => {
  const usersCollectionRef = collection(db, "botchat");
  const getUsers = async () => {
    const filteredData = query(
      usersCollectionRef,
      where("type", "==", false),
      where("valid", "==", false)
    );
    let arr = [];
    const querySnapshot = await getDocs(filteredData);
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), firebase_id: doc.id, id: uuidv4() });
    });
    dispatch({
      type: GET_ADMIN_INVALID_QUESTIONS,
      payload: arr,
    });
  };
  getUsers();
};

export const editValidQuestion =  (quesid) => (dispatch) => {
  const getEditQuestion = async () => {
    const queryRef = doc(db, "botchat", quesid );
    await updateDoc(queryRef, {
      valid: false
   });
    const usersCollectionRef = collection(db, "botchat");
    const filteredData = query(
    usersCollectionRef,
    where("type", "==", false),
    where("valid", "==", true)
    );
    let arr = [];
    const querySnapshot = await getDocs(filteredData);
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), firebase_id: doc.id, id: uuidv4() });
    });
    dispatch({
      type: EDIT_ADMIN_VALID_QUESTIONS,
      payload: arr,
    });
  };
  getEditQuestion();  
};

export const editInvalidQuestion =  (quesid) => (dispatch) => {
  const getEditQuestion = async () => {
    const queryRef = doc(db, "botchat", quesid );
    await updateDoc(queryRef, {
      valid: true
   });
    const usersCollectionRef = collection(db, "botchat");
    const filteredData = query(
      usersCollectionRef,
      where("type", "==", false),
      where("valid", "==", false)
    );
    let arr = [];
    const querySnapshot = await getDocs(filteredData);
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), firebase_id: doc.id, id: uuidv4() });
    });
    dispatch({
      type:  EDIT_ADMIN_INVALID_QUESTIONS,
      payload: arr,
    });
  };
  getEditQuestion();  
};
