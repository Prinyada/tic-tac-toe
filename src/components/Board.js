import React from "react";
import { Box } from "./Box";
import "./Board.css";

export const Board = ({ board, onClick, isClick, style, isWin }) => {
  return (
    <div>
      {isClick && (
        <div style={style}>
          {board.map((value, idx) => {
            return <Box key={idx} value={value} onClick={() => onClick(idx)} />;
          })}
        </div>
      )}
      {(isWin === "x" || isWin === "o" || isWin === "-") && (
        <div style={style}>
          {board.map((value, idx) => {
            return <Box key={idx} value={value} />;
          })}
        </div>
      )}
    </div>
  );
};