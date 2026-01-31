import React, { useState, useEffect } from "react";
import "./App.css";
import TodoApp from "./components/TodoApp";
import TaskManApp from "./components/TaskManApp";
import SignInWithGoogle from "./components/SignInWithGoogle";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showGameVersion, setShowGameVersion] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`taskman-tasks-${user.email}`);
      const savedScore = localStorage.getItem(`taskman-score-${user.email}`);
      const savedLevel = localStorage.getItem(`taskman-level-${user.email}`);
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
      setScore(savedScore ? Number(savedScore) : 0);
      setLevel(savedLevel ? Number(savedLevel) : 1);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `taskman-tasks-${user.email}`,
        JSON.stringify(tasks)
      );
    }
  }, [tasks, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`taskman-score-${user.email}`, score.toString());
    }
  }, [score, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`taskman-level-${user.email}`, level.toString());
    }
  }, [level, user]);

  if (!user) {
    return (
      <div className="app-body">
        <div className="app-container">
          <SignInWithGoogle
            onSignIn={(userData) => {
              setUser(userData);
              setToken(userData.accessToken);
            }}
          />
          <button
            className="mode-switch-button"
            onClick={() => setShowGameVersion(!showGameVersion)}
          >
            Switch to {showGameVersion ? "Classic Mode 💾" : "Game Mode 🎮"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-body">
      <div className="app-container">
        <div className="welcome-bar">
          <span className="welcome-text">
            Hi{" "}
            {user.name.split(" ")[0].charAt(0).toUpperCase() +
              user.name.split(" ")[0].slice(1)}
          </span>
          <button
            className="signout-button"
            onClick={() => {
              setUser(null);
              setToken(null);
            }}
          >
            Sign Out
          </button>
        </div>

        <button
          className="mode-switch-button"
          onClick={() => setShowGameVersion(!showGameVersion)}
        >
          Switch to {showGameVersion ? "Classic Mode 💾" : "Game Mode 🎮"}
        </button>

        {showGameVersion ? (
          <TaskManApp
            tasks={tasks}
            setTasks={setTasks}
            score={score}
            setScore={setScore}
            level={level}
            setLevel={setLevel}
            user={user}
            token={token}
          />
        ) : (
          <TodoApp tasks={tasks} setTasks={setTasks} />
        )}
      </div>
    </div>
  );
}

export default App;