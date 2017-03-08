import { expect } from "chai";
import { closeWindow } from "./actions";

describe("Renderer Process action creator", function() {
  it("'closeWindow' returns an action object with the type 'CLOSE'", function() {
    expect(closeWindow()).to.have.property("type", "CLOSE");
  });
});
