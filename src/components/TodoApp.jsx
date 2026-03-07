// src/components/TodoApp.jsx
import React, { useState } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import DoneStatusTabs from "./DoneStatusTabs";
import "../App.css";

function TodoApp({ tasks = [], setTasks: externalSetTasks, calendarToken, onRequestCalendarAccess }) {
  const [internalTasks, internalSetTasks] = useState(tasks);
  const [tab, setTab] = useState("all");

  const actualTasks = externalSetTasks ? tasks : internalTasks;
  const setTasks = externalSetTasks || internalSetTasks;

  const addTask = (text, priority, date, category, deadline, participants) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      priority,
      completed: false,
      date,
      deadline,
      category,
      users: [],
      participants: participants || "",
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTaskCompleted = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const filteredTasks = actualTasks.filter((task) => {
    if (!tab) return true;
    if (tab.toLowerCase() === "all") return true;
    if (tab.toLowerCase() === "done") return task.completed;
    return (task.category || "").toLowerCase() === tab.toLowerCase();
  });

  return (
    <div className="todo-container">
      <TaskInput onAddTask={addTask} />
      <DoneStatusTabs tab={tab} setTab={setTab} />
      <TaskList
        tasks={filteredTasks}
        removeTask={removeTask}
        toggleTaskCompleted={toggleTaskCompleted}
        onEditTask={handleEditTask}
        calendarToken={calendarToken}
        onRequestCalendarAccess={onRequestCalendarAccess}
      />

      <div className="signature">© TM by TK ~ 2025</div>
    </div>
  );
}

export default TodoApp;


