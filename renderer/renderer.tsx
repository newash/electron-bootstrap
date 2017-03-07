import * as React from "react";
import { render } from "react-dom";
import "../assets/index.html";

function closeWindow(e: React.MouseEvent<HTMLButtonElement>) {
  window.close();
}

export const App = () => {
  return <div className="mui-container-fluid mui--text-center">
    <div className="mui--text-dark mui--text-headline">Hello, this is the Renderer process</div>
    <button className="mui-btn mui-btn--raised mui-btn--primary" onClick={closeWindow}>Close window</button>
  </div>;
}

render(<App />, document.getElementById("root") );
