import React from "react";
import { Box } from "./Box";
import "./Board.css";

export const Board = ({ board, onClick, isClick,style }) => {
  return (
    <div>
      {isClick && (
        <div style={style}>
          {board.map((value, idx) => {
            return <Box key={idx} value={value} onClick={() => onClick(idx)} />;
          })}
        </div>
      )}
    </div>
  );
};