import React, { useState, useEffect } from "react";
import SignInWithGoogle from "./SignInWithGoogle";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";

const TaskManWithUser = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Load tasks by user
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`taskman-tasks-${user.email}`);
      setTasks(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  // Save tasks by user
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `taskman-tasks-${user.email}`,
        JSON.stringify(tasks)
      );
    }
  }, [tasks, user]);

  const handleAddTask = (text, priority, date) => {
    const newTask = {
      id: Date.now(),
      text,
      priority,
      completed: false,
      date,
    };
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleTaskCompleted = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (!user) {
    return <SignInWithGoogle onSignIn={setUser} />;
  }

  return (
    <div className="todo-container">
      <h2>Hello {user.name || user.email}!</h2>
      {user.picture && (
        <img
          src={user.picture}
          alt="User"
          style={{ width: 50, borderRadius: "50%" }}
        />
      )}

      <TaskInput onAddTask={handleAddTask} />

      <TaskList
        tasks={tasks}
        removeTask={handleRemoveTask}
        toggleTaskCompleted={handleToggleTaskCompleted}
      />

      <button onClick={() => setUser(null)}>Sign Out</button>
    </div>
  );
};

export default TaskManWithUser;
