import * as React from "react";
import { render } from "react-dom";
import { MiddlewareAPI, Dispatch, Action } from "redux";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import reducer, { State } from "./reducer";
import App from "./components/App";
import "../assets/index.html";

const windowCloserMiddleware = (store: MiddlewareAPI<any>) => (next: Dispatch<any>) => (action: Action): Action => {
  let result = next(action);
  if ((store.getState() as State).windowOpen === false) {
    window.close();
  }
  return result;
};

const store = createStore(reducer, applyMiddleware(windowCloserMiddleware));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
