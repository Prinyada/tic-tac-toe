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
  const [xPlaying, setXplaying] = useState(false);

  // save to database
  const [size, setSize] = useState(3);
  let winner;
  let loser;
  let toetoe;
  let resultGame;

  const [allData, setAllData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { Option } = Select;
  const [endGame, setEndGame] = useState(false);

  const [winEndGame, setWinEndGame] = useState("");

  const [isWin, setIsWin] = useState("");
  const [isIndex, setIsIndex] = useState(Number);
  const [isResult, setIsResult] = useState([]);
  const [isSize, setIsSize] = useState(Number);

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
    setEndGame(false);
    setWinEndGame("");
    setSize(parseInt(size));
    setIsClick(true);
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

  // Check Winner
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
      resultGame = tempStringX;
      winner = "x";
      loser = "o";
      toetoe = "-";
      addData(winner, loser, toetoe, resultGame, size);
      setEndGame(true);
      setWinEndGame("x");
    } else if (winO.success === true) {
      const tempStringO = winO.data.join("");
      resultGame = tempStringO;
      winner = "o";
      loser = "x";
      toetoe = "-";
      addData(winner, loser, toetoe, resultGame, size);
      setEndGame(true);
      setWinEndGame("o");
    } else if (
      !winX.data.includes("N") &&
      !winO.data.includes("N") &&
      !winX.data.includes(null) &&
      !winO.data.includes(null) &&
      winX.success === false &&
      winO.success === false
    ) {
      setEndGame(true);
      const tempStringXO = winX.data.join("");
      resultGame = tempStringXO;
      winner = "-";
      loser = "-";
      toetoe = "toe";
      addData(winner, loser, toetoe, resultGame, size);
      setWinEndGame("toe");
    }
  };

  // Select Show Data
  function selectData(value) {
    setIsOpen(true);
    let newShowData = [];
    allData.map((data, index) => {
      if (index === value) {
        const stringResult = data.result;
        const stringToArray = stringResult.split("");
        if (stringToArray.includes("N")) {
          newShowData = stringToArray.map((n) => (n === "N" ? null : n));
          setIsWin(data.win);
          setIsIndex(index + 1);
          setIsResult(newShowData);
          setIsSize(data.size);
        } else {
          setIsWin(data.win);
          setIsIndex(index + 1);
          setIsResult(stringToArray);
          setIsSize(data.size);
        }
      }
    });
  }

  // add data to database
  async function addData(w, l, t, r, s) {
    await axios.post("http://localhost:8000/data", {
      win: w,
      lose: l,
      toe: t,
      result: r,
      size: s,
    });

    allData.push({
      win: w,
      lose: l,
      toe: t,
      result: r,
      size: s,
    });
    await wait(3000);
    createBoard();
  }

  // get data from database
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
              <Option key={index} value={index} label={`Round ${index + 1}`}>
                Round {index + 1}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="board-size">
        {size} x {size}
      </div>
      <Dialog
        isOpen={isOpen}
        showIndex={isIndex}
        showWin={isWin}
        showResult={isResult}
        showSize={isSize}
        onClose={(e) => setIsOpen(false)}
      ></Dialog>
      <Board
        style={style}
        board={board}
        onClick={handleBoxClick}
        isClick={isClick}
      />
      {endGame === true && (winEndGame === "x" || winEndGame === "o") ? (
        <div className="board-text-winner">Winner is {winEndGame}</div>
      ) : (
        <div className="board-text-winner">{winEndGame}</div>
      )}
    </div>
  );
}

export default App;
