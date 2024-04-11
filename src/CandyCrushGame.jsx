import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import candy1 from "./assets/images/c1.jpg"
import candy2 from "./assets/images/c2.jpg"
import candy3 from "./assets/images/c3.jpg"
import candy4 from "./assets/images/c4.jpg"
import candy5 from "./assets/images/c5.jpg"

const candyImages = [
  candy1,
  candy2,
  candy3,
  candy4,
  candy5,
];

const numRows = 8;
const numCols = 8;

const generateRandomCandy = () => {
  const randomIndex = Math.floor(Math.random() * candyImages.length);
  return candyImages[randomIndex];
};

const generateRandomBoard = () => {
  const board = [];
  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < numCols; j++) {
      row.push(generateRandomCandy());
    }
    board.push(row);
  }
  return board;
};
const CandyCrushGame = () => {
  const [board, setBoard] = useState(generateRandomBoard());
  const [selectedCell, setSelectedCell] = useState(null);
  const [movesLeft, setMovesLeft] = useState(20);
  let [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [matchedCells, setMatchedCells] = useState([]);
  const [animationTrigger, setAnimationTrigger] = useState(false);

  const scoreResetRef = useRef(false);

  useEffect(() => {
    if (scoreResetRef.current) {
      setScore(0);
      scoreResetRef.current = false;
    }
  }, [score]);

  useEffect(() => {
    if (matchedCells.length > 0) {
      setAnimationTrigger(true);
      setTimeout(() => {
        setAnimationTrigger(false);
        setMatchedCells([]);
      }, 500); // Adjust the duration as needed
    }
  }, [matchedCells]);

  const handleCellClick = (row, col) => {
    if (!selectedCell) {
      setSelectedCell({ row, col });
    } else {
      if (Math.abs(selectedCell.row - row) + Math.abs(selectedCell.col - col) === 1) {
        swapCells(selectedCell.row, selectedCell.col, row, col);
      }
      setSelectedCell(null);
    }
  };

  const swapCells = (row1, col1, row2, col2) => {
    const newBoard = [...board];
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = temp;
    setBoard(newBoard);
    checkForMatchesAndUpdateBoard(newBoard); // Check for matches after swapping cells
  };

  const checkForMatchesAndUpdateBoard = (currentBoard) => {
    let newBoard = [...currentBoard];
    let newScore = score;
    let reshuffleNeeded = false; // Flag to track if reshuffle is needed

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (
          col < numCols - 2 &&
          newBoard[row][col] === newBoard[row][col + 1] &&
          newBoard[row][col] === newBoard[row][col + 2]
        ) {
          newScore += 1; // Increment score
          setMatchedCells([...matchedCells, { row, col }, { row, col: col + 1 }, { row, col: col + 2 }]);
          newBoard[row][col] = null;
          newBoard[row][col + 1] = null;
          newBoard[row][col + 2] = null;
          reshuffleNeeded = true;

        }
        if (
          row < numRows - 2 &&
          newBoard[row][col] === newBoard[row + 1][col] &&
          newBoard[row][col] === newBoard[row + 2][col]
        ) {
          newScore += 1; // Increment score
          setMatchedCells([...matchedCells, { row, col }, { row: row + 1, col }, { row: row + 2, col }]);
          newBoard[row][col] = null;
          newBoard[row + 1][col] = null;
          newBoard[row + 2][col] = null;
          reshuffleNeeded = true; // Set flag to true if match found
        }
      }
    }

    if (reshuffleNeeded) { // If reshuffle is needed
      reshuffleBoard(newBoard); // Reshuffle the board
    } else { // If no reshuffle needed, proceed with normal update
      updateBoard(newBoard, newScore);
    }
  };

  const reshuffleBoard = (currentBoard) => {
    let newBoard = [...currentBoard];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (newBoard[row][col] === null) { // If cell is empty
          newBoard[row][col] = generateRandomCandy(); // Fill it with a new candy
        }
      }
    }
    updateBoard(newBoard, score); // Update the board with reshuffled candies
  };

  const updateBoard = (newBoard, newScore) => {
    setScore(newScore);
    setBoard(newBoard);

  };

  // Other parts of the component remain unchanged...

  const restartGame = () => {
    console.log("Restarting game...");
    scoreResetRef.current = true;
    setBoard(generateRandomBoard());
    setMovesLeft(20);
  };

  useEffect(() => {
    checkForMatchesAndUpdateBoard(board);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="game-container">
      <div className="game-info">
        <div>Moves Left: {movesLeft}</div>
        <div>Score: {score}</div>
        <div>Level: {level}</div>
        <button onClick={restartGame}>Restart Game</button>
      </div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((candy, colIndex) => (
              <img
                key={colIndex}
                className={`cell ${animationTrigger && matchedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) ? 'matched' : ''}`}
                src={candy}
                alt={`Candy at (${rowIndex}, ${colIndex})`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>

        ))}
      </div>
    </div>
  );
};

export default CandyCrushGame;
