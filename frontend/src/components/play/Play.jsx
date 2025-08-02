import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Play.css";

const Play = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const audioRef = useRef(new Audio("/music.mp3"));
  const navigate = useNavigate();

  // ✅ Auto-play music and stop on unmount
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.play().catch((err) => console.log("Autoplay blocked:", err));

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset to start
    };
  }, []);

  // ✅ Computer's turn (O)
  useEffect(() => {
    if (!isXNext && !winner && !isDraw) {
      const timer = setTimeout(() => {
        computerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, isDraw]);

  const handleClick = (index) => {
    if (board[index] || winner || isDraw || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    checkGameStatus(newBoard);
    setIsXNext(false);
  };

  const computerMove = () => {
    const emptyCells = board
      .map((value, index) => (value === null ? index : null))
      .filter((val) => val !== null);

    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = "O";
    setBoard(newBoard);
    checkGameStatus(newBoard);
    setIsXNext(true);
  };

  const checkGameStatus = (newBoard) => {
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        saveWinToBackend(); // ✅ Save win in backend
      }
      return;
    }
    if (newBoard.every((cell) => cell !== null)) {
      setIsDraw(true);
    }
  };

  const saveWinToBackend = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      await fetch("https://game-backend-6.onrender.com/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error saving win:", error);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsDraw(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a Draw!"
    : `Next Player: ${isXNext ? "X (You)" : "O (Computer)"}`;

  return (
    <div className="tic-tac-toe-container">
      {/* Top Navigation */}
      <div className="top-bar">
        <div className="top-buttons">
          <button className="nav-btn" onClick={() => navigate("/gamehome")}>Home</button>
          <button className="nav-btn" onClick={resetGame}>Play Again</button>
        </div>
        <div className="music-icon" onClick={toggleMute}>
          {isMuted ? "🔇" : "🎵"}
        </div>
      </div>

      {/* Game Board */}
      <div className="game-board">
        <h2>TIC TAC TOE</h2>
        <p>{status}</p>
        <div className="board-grid">
          {board.map((cell, index) => (
            <button
              key={index}
              className="cell"
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {/* Winner or Draw Overlay */}
      {(winner || isDraw) && (
        <div className="winner-overlay">
          <h1>{winner ? `${winner} Wins!` : "It's a Draw!"}</h1>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

// ✅ Winner Calculation
function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default Play;
