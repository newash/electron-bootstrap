import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { closeWindow } from "../actions";

function mapStateToProps(state: any, ownProps: { className?: string, children?: React.ReactNode }) {
  return ownProps;
}

export default connect(mapStateToProps)((props: { className?: string, children?: React.ReactNode, dispatch?: Dispatch<any> }) => {
  return <button className={props.className} onClick={() => props.dispatch(closeWindow())}>{props.children}</button>;
});
