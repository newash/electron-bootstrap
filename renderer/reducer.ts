import { Action } from "redux";

export type State = {
  windowOpen: boolean;
};

export default(state: State = {
  windowOpen: true
}, action: Action): State => {
  if (action.type === "CLOSE") {
    return { ...state, windowOpen: false };
  }
  return state;
};
