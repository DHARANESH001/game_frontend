import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderBoard.css";

const LeaderBoard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        const tokenData = localStorage.getItem("user");
        if (!tokenData) {
          setError("Please log in first.");
          setLoading(false);
          return;
        }

        const token = JSON.parse(tokenData).token;
        const response = await fetch("http://localhost:8080/api/game/leaderboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const data = await response.json();
        setLeaders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderBoard();
  }, []);

  if (loading) return <div className="leaderboard-container">Loading...</div>;
  if (error) return <div className="leaderboard-container">Error: {error}</div>;

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <div className="header-bar">
        <button className="home-btn" onClick={() => navigate("/gamehome")}>
          ⬅ Home
        </button>
        <h1 className="leaderboard-title">🏆 Leaderboard</h1>
      </div>

      {/* Table */}
      <div className="leaderboard-card">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {leaders.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">No data available</td>
              </tr>
            ) : (
              leaders.map((player, index) => (
                <tr
                  key={player.username}
                  className={`rank-${index + 1}`}
                >
                  <td>{index + 1}</td>
                  <td>{player.username}</td>
                  <td>{player.wins}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;
