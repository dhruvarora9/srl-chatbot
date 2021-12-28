import {
  ADMIN_LOADING,
  GET_ADMIN_INVALID_QUESTIONS,
  GET_ADMIN_VALID_QUESTIONS,
  EDIT_ADMIN_VALID_QUESTIONS,
  EDIT_ADMIN_INVALID_QUESTIONS,
  GET_ADMIN_ANSWERED_QUESTIONS
} from "../action-types/actionTypes";

const initialState = {
  loading: false,
  validQuestionList: [],
  invalidQuestionList: [],
  answeredQuestionList: [],
  error: null,
};

const admin = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_LOADING:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case GET_ADMIN_VALID_QUESTIONS:
      return {
        ...state,
        loading: false,
        error: null,
        validQuestionList: action.payload,
      };
    case GET_ADMIN_INVALID_QUESTIONS:
      return {
        ...state,
        loading: false,
        error: null,
        invalidQuestionList: action.payload,
      };
    case EDIT_ADMIN_VALID_QUESTIONS:
      return {
        ...state,
        loading: false,
        error: null,
        validQuestionList: action.payload,
      };
    case EDIT_ADMIN_INVALID_QUESTIONS:
      return {
        ...state,
        loading: false,
        error: null,
        invalidQuestionList: action.payload,
      };
    case  GET_ADMIN_ANSWERED_QUESTIONS: 
      return {
        ...state,
        loading: false,
        error: null,
        answeredQuestionList: action.payload,
      };
    default:
      return state;
  }
};

export default admin;
