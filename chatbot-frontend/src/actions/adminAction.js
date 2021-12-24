import { collection, getDocs, query, where } from "firebase/firestore";
import {
  GET_ADMIN_INVALID_QUESTIONS,
  GET_ADMIN_VALID_QUESTIONS,
} from "../action-types/actionTypes";
import { db } from "../firebase/app";

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
      arr.push(doc.data());
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
      arr.push(doc.data());
    });
    dispatch({
      type: GET_ADMIN_INVALID_QUESTIONS,
      payload: arr,
    });
  };
  getUsers();
};