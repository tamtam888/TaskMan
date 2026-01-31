import React, { useState, useEffect } from "react";
import Title from "./Title";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import DoneStatusTabs from "./DoneStatusTabs";
import "./TaskManApp.css";

const addSound = process.env.PUBLIC_URL + "/sounds/add.mp3";
const completeSound = process.env.PUBLIC_URL + "/sounds/complete.mp3";
const deleteSound = process.env.PUBLIC_URL + "/sounds/trash.mp3";
const levelupSound = process.env.PUBLIC_URL + "/sounds/levelup.mp3";
const gameoverSound = process.env.PUBLIC_URL + "/sounds/gameover.mp3";

const TaskManApp = ({ tasks, setTasks, score, setScore, level, setLevel, user, token }) => {
  const [tab, setTab] = useState("all");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [eatingTaskId, setEatingTaskId] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const calculatePoints = (priority, deadline) => {
    let basePoints = 0;
    
    if (priority === "high") basePoints = 30;
    else if (priority === "normal") basePoints = 20;
    else basePoints = 10;

    if (deadline) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const [day, month, year] = deadline.split("/");
      const deadlineDate = new Date(year, month - 1, day);
      deadlineDate.setHours(0, 0, 0, 0);
      const daysUntilDeadline = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

      if (daysUntilDeadline <= 1) {
        basePoints += 20;
      } else if (daysUntilDeadline <= 3) {
        basePoints += 10;
      } else if (daysUntilDeadline <= 7) {
        basePoints += 5;
      }
    }

    return basePoints;
  };

  const handleAddTask = (text, priority, date, category, deadline, participants) => {
    let usersArray = [];
    let participantsString = "";

    if (Array.isArray(participants)) {
      usersArray = participants.filter(Boolean).map((s) => String(s).trim()).filter(Boolean);
      participantsString = usersArray.join(", ");
    } else if (typeof participants === "string") {
      const p = participants.trim();
      usersArray = p ? p.split(",").map((s) => s.trim()).filter(Boolean) : [];
      participantsString = usersArray.join(", ");
    }

    const newTask = {
      id: Date.now(),
      text,
      priority,
      date,
      category,
      deadline,
      completed: false,
      users: usersArray,
      participants: participantsString,
    };

    setTasks((prev) => [...prev, newTask]);
    playSound(addSound);
    setGameOver(false);
  };

  const handleRemoveTask = (id) => {
    setTimeout(() => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }, 300);
    playSound(deleteSound);
  };

  const handleToggleTaskCompleted = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const updated = { ...task, completed: !task.completed };

          if (updated.completed) {
            const points = calculatePoints(task.priority, task.deadline);
            const newScore = score + points;
            setScore(newScore);

            setEatingTaskId(id);
            setTimeout(() => setEatingTaskId(null), 2000);
            setTimeout(() => playSound(completeSound), 100);

            const newLevel = Math.floor(newScore / 100) + 1;
            if (newLevel > level) {
              setLevel(newLevel);
              setShowLevelUp(true);
              playSound(levelupSound);
              setTimeout(() => setShowLevelUp(false), 3000);
            }
          } else {
            const points = calculatePoints(task.priority, task.deadline);
            const newScore = score - points;
            setScore(newScore);
            setLevel(Math.max(1, Math.floor(newScore / 100)));
          }

          return updated;
        }
        return task;
      })
    );
  };

  const handleEditTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleRestart = () => {
    setTasks([]);
    setScore(0);
    setLevel(1);
    setGameOver(false);

    if (user) {
      localStorage.removeItem(`taskman-tasks-${user.email}`);
      localStorage.removeItem(`taskman-score-${user.email}`);
      localStorage.removeItem(`taskman-level-${user.email}`);
    }
  };

  useEffect(() => {
    if (tasks.length > 0 && tasks.every((task) => task.completed)) {
      setGameOver(true);
      playSound(gameoverSound);
    }
  }, [tasks]);

  const priorityOrder = { high: 1, normal: 2, low: 3 };

  const filteredTasks = tasks
    .filter((task) => {
      if (tab === "all") return true;
      if (tab === "done") return task.completed;
      return task.category === tab;
    })
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="todo-container">
      <Title />
      {showLevelUp && <div className="levelup-banner">🏆 LEVEL UP! Level {level}</div>}

      <div className="score">🎯 Score: {score} 🔥 Level: {level}</div>

      <TaskInput onAddTask={handleAddTask} />
      <DoneStatusTabs tab={tab} setTab={setTab} />

      {gameOver ? (
        <div className="game-over-banner">
          🎉 Game Over 🎉 All Tasks Completed 🏆
          <button className="restart-button" onClick={handleRestart}>▶️ Play Again</button>
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          removeTask={handleRemoveTask}
          toggleTaskCompleted={handleToggleTaskCompleted}
          eatingTaskId={eatingTaskId}
          tab={tab}
          onEditTask={handleEditTask}
          accessToken={token}
        />
      )}

      <div className="signature">© TM by TK ~ 2025</div>
    </div>
  );
};

export default TaskManApp;
