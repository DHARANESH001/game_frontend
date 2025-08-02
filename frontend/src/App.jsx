import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import GameHome from './components/gamehome/GameHome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LeaderBoard from './components/options/LeaderBoard';
import Play from './components/play/Play';
import Profile from './components/profile/Profile';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gamehome" element={<GameHome />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/play" element={<Play />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
