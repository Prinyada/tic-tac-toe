import React from "react";
import "./Dialog.css";
import { Board } from "./Board";

function Dialog(props) {
  console.log("pros -> ",props.showResult);

  const style = {
    display: "grid",
    gridTemplateColumns: `repeat(${props.showSize},6rem)`,
    placeItems: "center",
    justifyContent: "center",
  };

  let dialog = (
    <div className="dialog-style">
      <button className="dialog-closeButtonStyle" onClick={props.onClose}>
          x
      </button>
      <p>Round {props.showIndex}</p>
      <p>{props.showSize} x {props.showSize}</p>
      <Board
        style={style}
        board={props.showResult}
        isWin={props.showWin}
      />
      <p>Winner is <span>{props.showWin}</span></p>
    </div>
  );

  if (!props.isOpen) {
    dialog = null;
  }
  return <div>{dialog}</div>;
}

export default Dialog;
