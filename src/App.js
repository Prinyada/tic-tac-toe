import "./App.css";
import { Board } from "./components/Board";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Button, Input, Select } from "antd";
import Dialog from "./components/Dialog";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isClick, setIsClick] = useState(false);
  const [xPlaying, setXplaying] = useState(true);

  // save to database
  const [size, setSize] = useState(3);
  let win;
  let lose;
  let toe;
  let result;

  const [allData, setAllData] = useState([]);
  const [select, setSelect] = useState();
  const [isOpen, setIsOpen] = useState(false);

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const style = {
    display: "grid",
    gridTemplateColumns: `repeat(${size},6rem)`,
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

  function isWinningState(updateBoard, symbol) {
    let tempBoard = updateBoard;
    let newUpdateBoard;
    tempBoard = convertTo2DArray(tempBoard, size, size); // เอาไว้เช็คเฉยๆ

    // Check rows
    for (let row = 0; row < size; row++) {
      let rowWin = true;
      for (let col = 0; col < size; col++) {
        if (tempBoard[row][col] !== symbol) {
          rowWin = false;
          break;
        }
      }
      if (rowWin) {
        if (updateBoard.includes(null)) {
          newUpdateBoard = updateBoard.map((n) => (n === null ? "N" : n));
        }
        return { success: true, data: newUpdateBoard };
      }
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
      if (colWin) {
        if (updateBoard.includes(null)) {
          newUpdateBoard = updateBoard.map((n) => (n === null ? "N" : n));
        }
        return { success: true, data: newUpdateBoard };
      }
    }

    // Check main diagonal (top-left to bottom-right)
    let mainDiagonalWin = true;
    for (let i = 0; i < size; i++) {
      if (tempBoard[i][i] !== symbol) {
        mainDiagonalWin = false;
        break;
      }
    }
    if (mainDiagonalWin) {
      if (updateBoard.includes(null)) {
        newUpdateBoard = updateBoard.map((n) => (n === null ? "N" : n));
      }
      return { success: true, data: newUpdateBoard };
    }

    // Check anti-diagonal (top-right to bottom-left)
    let antiDiagonalWin = true;
    for (let i = 0; i < size; i++) {
      if (tempBoard[i][size - 1 - i] !== symbol) {
        antiDiagonalWin = false;
        break;
      }
    }
    if (antiDiagonalWin) {
      if (updateBoard.includes(null)) {
        newUpdateBoard = updateBoard.map((n) => (n === null ? "N" : n));
      }
      return { success: true, data: newUpdateBoard };
    }

    return { success: false, data: updateBoard }; // No winning state found
  }

  const handleBoxClick = (boxIdx) => {
    const updatedBoard = board.map((value, idx) => {
      if (idx === boxIdx) {
        return xPlaying === false ? "X" : "O";
      } else {
        return value;
      }
    });

    setBoard(updatedBoard);
    setXplaying(!xPlaying);

    const winX = isWinningState(updatedBoard, "X");
    const winO = isWinningState(updatedBoard, "O");

    if (winX.success === true) {
      const tempStringX = winX.data.join("");
      result = tempStringX;
      win = "x";
      lose = "o";
      toe = "-";
      addData(win, lose, toe, result, size);
    } else if (winO.success === true) {
      const tempStringO = winO.data.join("");
      result = tempStringO;
      win = "o";
      lose = "x";
      toe = "-";
      addData(win, lose, toe, result, size);
    } else if (
      !winX.data.includes("N") &&
      !winO.data.includes("N") &&
      !winX.data.includes(null) &&
      !winO.data.includes(null) &&
      winX.success === false &&
      winO.success === false
    ) {
      const tempStringXO = winX.data.join("");
      result = tempStringXO;
      win = "-";
      lose = "-";
      toe = "toe";
      addData(win, lose, toe, result, size);
    }
  };

  // Select Show Data

  const { Option } = Select;

  function selectData(value){
    setIsOpen(true)
    console.log(value);
    allData.map((data, index) => {
      console.log(index);
    })
  }

  // API
  async function addData(win, lose, toe, result, size) {
    await axios.post("http://localhost:8000/data", {
      win: win,
      lose: lose,
      toe: toe,
      result: result,
      size: size,
    });

    allData.push({
      win: win,
      lose: lose,
      toe: toe,
      result: result,
      size: size,
    });
    await wait(3000);
    createBoard();
  }

  async function getData() {
    const data = await axios
      .get("http://localhost:8000/data", { crossdomain: true })
      .then((response) => {
        return response.data.data;
      });
    setAllData(data);
  }

  useEffect(() => {
    createBoard();
    getData();
  }, []);

  return (
    <div className="App">
      <div className="header-board">
        <div className="header-board-content">
          <span>Size : </span>
          <Input
            placeholder="input size"
            style={{
              width: 100,
            }}
            onChange={handleValueChange}
          />
          &nbsp;
          <Button type="primary" onClick={createBoard}>
            OK
          </Button>
          &nbsp;
          <Select
            placeholder="History"
            style={{ width: 100, marginLeft: 20 }}
            optionLabelProp="label"
            onChange={(value) => {
              selectData(value);
            }}
          >
            {allData.map((data, index) => (
              <Option key={index} value={index} label={`Round ${index+1}`}>
                Round {index+1}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="board-size">
        {size} x {size}
      </div>
      <Dialog isOpen={isOpen} onClose={(e) => setIsOpen(false)}></Dialog>
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
