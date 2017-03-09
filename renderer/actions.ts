import { Action } from "redux";

export function closeWindow(): Action {
  return {
    type: "CLOSE"
  };
}
