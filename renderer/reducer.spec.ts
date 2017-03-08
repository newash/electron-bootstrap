import { expect } from "chai";
import reducer from "./reducer";

describe("Renderer Process reducer", function() {
  const closeAction = { type: "CLOSE" };
  const otherAction = { type: "FOOBAR" };
  const initialState = reducer(undefined, otherAction);

  it("returns 'windowOpen' being true as the initial state", function() {
    expect(initialState.windowOpen).to.be.true;
  });
  it("returns with a new state with 'windowOpen' being false for a 'CLOSE' action", function() {
    const newState = reducer(initialState, closeAction);
    expect(newState).not.to.equal(initialState);
    expect(newState.windowOpen).to.be.false;
  });
  it("returns with the same state for any other actions", function() {
    const newState = reducer(initialState, otherAction);
    expect(newState).to.be.equal(initialState);
  });
});
