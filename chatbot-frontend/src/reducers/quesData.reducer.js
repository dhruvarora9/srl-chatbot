import { initial } from "lodash";

const initialState = {
  loading: false,
  error: null,
  quesList: [
    {
      id: 1,
      text: "Hello",
    },
    {
      id: 2,
      text: "Hello",
    },
    {
      id: 3,
      text: "Hello",
    },
    {
      id: 4,
      text: "Hello",
    },
    {
      id: 5,
      text: "Hello",
    },
    {
      id: 6,
      text: "Hello",
    },
    {
      id: 7,
      text: "Hello",
    },
    {
      id: 8,
      text: "Hello",
    },
  ],
};

const quesData = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default quesData;
