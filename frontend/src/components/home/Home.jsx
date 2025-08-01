import React from 'react';
import './Home.css';
import Navigation from './Navigation';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <Navigation />
      <main className="main-content">
        {/* Hero Section */}
        <header className="hero-section">
          <h1>Welcome to Game Hub</h1>
          <div className="hero-content">
            <p>Play Tic Tac Toe, track your progress, and compete for the top spot!</p>
            <p>Sign in, play games, check the leaderboard, and manage your profile – all in one place.</p>
          </div>
        </header>
        {/* Features Section */}
        <section className="features-section">
          <div className="feature-card">
            <h3>🎮 Play Tic Tac Toe</h3>
            <p>Challenge the computer in a fun game of Tic Tac Toe. Keep practicing to improve your skills and earn more wins!</p>
          </div>
          <div className="feature-card">
            <h3>🏆 Live Leaderboard</h3>
            <p>Compete with other players and climb to the top. The leaderboard updates in real-time based on your wins.</p>
          </div>
          <div className="feature-card">
            <h3>👤 Manage Your Profile</h3>
            <p>Update your personal details and upload your profile picture. Keep your account personalized.</p>
          </div>
          <div className="feature-card">
            <h3>🔐 Secure Login</h3>
            <p>All actions are protected with secure authentication. Your data is safe and private.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
