import React from 'react';
import { Link } from 'react-router-dom';
import './GameHome.css';

const GameHome = () => {
  return (
    <div className="game-home-container">
      <h1 className="game-title">Tic Tac Toe</h1>
      <div className="button-group">
        <Link to="/leaderboard" className="game-button">LeaderBoard</Link>
        <Link to="/play" className="game-button">Play</Link>
        <Link to="/profile" className="game-button">Profile</Link>
      </div>
    </div>
  );
};

export default GameHome;
