import "./App.css";
import { Board } from "./components/Board";
import React, { useEffect } from "react";
import { useState } from "react";

function App() {
  const [board, setBoard] = useState(Array);
  const [isClick, setIsClick] = useState(false);
  const [xPlaying, setXplaying] = useState(true);

  // save to database
  const [size, setSize] = useState(3); 
  const [win, setWin] = useState(""); 
  const [lose, setLose] = useState(""); 
  const [toe, setToe] = useState(false); 
  const [result, setResult] = useState(""); 

  let allDataHistory = [];
  let saveWinToDb;

  const style = {
    display: "grid",
    gridTemplateColumns: `repeat(${size},4rem)`,
    placeItems: "center",
    justifyContent: "center",
  };

  const handleValueChange = (event) => {
    setIsClick(false);
    setSize(event.target.value);
  };

  const createBoard = () => {
    setIsClick(true);
    setSize(parseInt(size));

    let resultSize = Math.pow(size, 2);

    setBoard(Array(resultSize).fill(null));
  };

  function convertTo2DArray(oneDArray, rows, columns) {
    const twoDArray = [];
  
    // Check if the given rows and columns are valid for the 1D array length
    if (rows * columns !== oneDArray.length) {
      throw new Error("Invalid dimensions for conversion");
    }
  
    for (let i = 0; i < rows; i++) {
      // Get a slice of the 1D array for each row
      const rowSlice = oneDArray.slice(i * columns, (i + 1) * columns);
      twoDArray.push(rowSlice);
    }
  
    return twoDArray;
  }

  function convertTo1DArray(twoDArray) {
    const oneDArray = [].concat(...twoDArray);
    return oneDArray;
  }
  
  
  function isWinningState(board, symbol) {
    let tempBoard = board;
    tempBoard = convertTo2DArray(tempBoard, size, size);

    // Check rows
    for (let row = 0; row < size; row++) {
      let rowWin = true;
      for (let col = 0; col < size; col++) {
        if (tempBoard[row][col] !== symbol) {
          rowWin = false;
          break;
        }
      }
      if (rowWin) return true;
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      let colWin = true;
      for (let row = 0; row < size; row++) {
        if (tempBoard[row][col] !== symbol) {
          colWin = false;
          break;
        }
      }
      if (colWin) return true;
    }

    // Check main diagonal (top-left to bottom-right)
    let mainDiagonalWin = true;
    for (let i = 0; i < size; i++) {
      if (tempBoard[i][i] !== symbol) {
        mainDiagonalWin = false;
        break;
      }
    }
    if (mainDiagonalWin) return true;

    // Check anti-diagonal (top-right to bottom-left)
    let antiDiagonalWin = true;
    for (let i = 0; i < size; i++) {
      if (tempBoard[i][size - 1 - i] !== symbol) {
        antiDiagonalWin = false;
        break;
      }
    }
    if (antiDiagonalWin) return true;

    return false; // No winning state found
  }

  const handleBoxClick = (boxIdx) => {
    
    const updatedBoard = board.map((value, idx) => {
      if (idx === boxIdx) {
        return xPlaying === true ? "X" : "O";
      } else {
        return value;
      }
    });
    
    setBoard(updatedBoard);
    setXplaying(!xPlaying);
    
    let winX = isWinningState(updatedBoard,"X");
    let winO = isWinningState(updatedBoard,"O");
    
    console.log("this winX -> ",winX);
    console.log("this winO -> ",winO);

  };


  useEffect(() => {
    createBoard();
  }, []);

  return (
    <div className="App">
      <div className="board">
        Size : &nbsp;
        <input onChange={handleValueChange} />
        &nbsp;
        <button onClick={createBoard}>OK</button>
      </div>
      <div className="board-size">
        {size} x {size}
      </div>
      <Board
        style={style}
        board={board}
        onClick={handleBoxClick}
        isClick={isClick}
      />
    </div>
  );
}

export default App;
