import * as React from "react";
import CloseButton from "./CloseButton";

export default () => {
  return <div className="mui-container-fluid mui--text-center">
    <div className="mui--text-dark mui--text-headline">Hello, this is the Renderer process</div>
    <CloseButton className="mui-btn mui-btn--raised mui-btn--primary">Close window</CloseButton>
  </div>;
}
