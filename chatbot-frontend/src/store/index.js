import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from "../reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const Enhancers = composeEnhancers(applyMiddleware(thunk));

export const store = createStore(reducers, Enhancers);
