import React from "react";
import TaskItem from "./TaskItem";
import "./TaskList.css";

function TaskList({ tasks, removeTask, toggleTaskCompleted, eatingTaskId, tab, onEditTask, accessToken }) {
  if (tasks.length === 0) {
    return <p>No tasks yet. Start adding some missions! 🎮</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={toggleTaskCompleted}
          onDelete={removeTask}
          eatingTaskId={eatingTaskId}
          onEdit={onEditTask}
          accessToken={accessToken}
        />
      ))}
    </ul>
  );
}

export default TaskList;
