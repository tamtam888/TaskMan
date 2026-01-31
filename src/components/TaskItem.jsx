import React, { useState } from "react";
import "./TaskItem.css";

function TaskItem({ task, onToggle, onDelete, eatingTaskId, onEdit, accessToken }) {
  console.log("🔍 TaskItem קיבל משימה:", task);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("/")) return dateString;
    const [year, month, day] = (dateString || "").split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateForStorage = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("-")) return dateString;
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const usersToString = (users, participants) => {
    if (Array.isArray(users)) return users.join(", ");
    if (typeof users === "string") return users;
    if (Array.isArray(participants)) return participants.join(", ");
    if (typeof participants === "string") return participants;
    return "";
  };
  const usersDisplay = usersToString(task.users, task.participants);

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [editedDeadline, setEditedDeadline] = useState(
    task.deadline ? formatDateForDisplay(task.deadline) : ""
  );
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedUsers, setEditedUsers] = useState(usersDisplay);
  const [syncing, setSyncing] = useState(false);

  const isValidDate = (dateString) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;
    const [d, m, y] = dateString.split("/").map(Number);
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  };

  const isFutureOrToday = (dateString) => {
    const [d, m, y] = dateString.split("/").map(Number);
    const inputDate = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  };

  const handleSave = () => {
    if (!isValidDate(editedDeadline)) {
      alert("Please enter a valid date in the format DD/MM/YYYY.");
      return;
    }
    if (!isFutureOrToday(editedDeadline)) {
      alert("Deadline must be today or a future date.");
      return;
    }

    const usersArray =
      editedUsers.trim() === ""
        ? []
        : editedUsers.split(",").map((u) => u.trim()).filter(Boolean);

    const updatedTask = {
      ...task,
      text: editedText,
      deadline: formatDateForStorage(editedDeadline),
      priority: editedPriority,
      users: usersArray,
      participants: editedUsers.trim(),
    };

    onEdit(updatedTask);
    setIsEditing(false);
  };

  const handleDeadlineChange = (e) => {
    let v = e.target.value.replace(/[^\d/]/g, "");
    if (v.length >= 2 && v.charAt(2) !== "/") v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length >= 5 && v.charAt(5) !== "/") v = v.slice(0, 5) + "/" + v.slice(5);
    if (v.length > 10) v = v.slice(0, 10);
    setEditedDeadline(v);
  };

  const handleSyncToCalendar = async () => {
    if (!accessToken) {
      alert("Please sign in with Google to sync to calendar");
      return;
    }

    if (!task.deadline) {
      alert("Task needs a deadline to sync to calendar");
      return;
    }

    if (task.syncedToCalendar) {
      alert("✅ This task is already synced to Google Calendar!");
      return;
    }

    setSyncing(true);

    try {
      const [day, month, year] = task.deadline.split("/");
      const deadlineDate = new Date(year, month - 1, day, 9, 0, 0);
      const endDate = new Date(deadlineDate.getTime() + 60 * 60 * 1000);

      const attendees = [];
      if (task.users && Array.isArray(task.users)) {
        task.users.forEach(email => {
          if (email && email.includes("@")) {
            attendees.push({ email: email.trim() });
          }
        });
      }

      const priorityEmoji = {
        high: "😡",
        normal: "🤔",
        low: "🤢"
      };

      const categoryEmoji = {
        shopping: "🛒",
        mission: "📋",
        other: "💡"
      };

      let description = `Task from TaskMan\n\n`;
      description += `${priorityEmoji[task.priority]} Priority: ${task.priority}\n`;
      description += `${categoryEmoji[task.category]} Category: ${task.category}\n`;
      if (task.participants) {
        description += `👥 Participants: ${task.participants}\n`;
      }
      const basePoints = task.priority === "high" ? 30 : task.priority === "normal" ? 20 : 10;
      description += `\n🎯 Base Points: ${basePoints}`;

      const colorMap = {
        high: "11",
        normal: "5",
        low: "9",
      };

      const event = {
        summary: `📋 ${task.text}`,
        description: description,
        start: {
          dateTime: deadlineDate.toISOString(),
          timeZone: "Asia/Jerusalem",
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: "Asia/Jerusalem",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 3 * 24 * 60 },
            { method: "popup", minutes: 1 * 24 * 60 },
            { method: "popup", minutes: 60 },
            { method: "email", minutes: 3 * 24 * 60 },
            { method: "email", minutes: 1 * 24 * 60 },
          ],
        },
        colorId: colorMap[task.priority] || "5",
        attendees: attendees.length > 0 ? attendees : undefined,
        sendUpdates: attendees.length > 0 ? "all" : "none",
      };

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to add to calendar");
      }

      const result = await response.json();
      
      const updatedTask = {
        ...task,
        syncedToCalendar: true,
        calendarEventId: result.id
      };
      onEdit(updatedTask);
      
      alert(`✅ Task synced to Google Calendar!`);
      console.log("Calendar event created:", result.htmlLink);

    } catch (error) {
      console.error("Sync error:", error);
      alert(`❌ Failed to sync: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <li className={`task-list-item task-item ${task.priority} ${task.completed ? "completed" : ""}`}>
      {!isEditing && (
        <button className="edit-btn" title="Edit task" onClick={() => setIsEditing(true)}>
          🖉
        </button>
      )}

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Task text"
            aria-label="Edit task"
          />
          <input
            type="text"
            value={editedDeadline}
            onChange={handleDeadlineChange}
            placeholder="DD/MM/YYYY"
            aria-label="Edit deadline"
            maxLength="10"
          />
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            aria-label="Edit priority"
          >
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <input
            type="text"
            value={editedUsers}
            onChange={(e) => setEditedUsers(e.target.value)}
            placeholder="Add participants"
            aria-label="Edit users"
          />
          <div className="edit-buttons">
            <button onClick={handleSave}>✅</button>
            <button onClick={() => setIsEditing(false)}>❌</button>
          </div>
        </div>
      ) : (
        <>
          <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />

          <span className="emoji-left">
            {task.priority === "high" ? "😡" : task.priority === "normal" ? "🤔" : "🤢"}
          </span>

          <span className="task-text">{task.text}</span>

          {usersDisplay && <span className="task-users">🧑‍🤝‍🧑 {usersDisplay}</span>}

          {task.deadline && (
            <span className="task-deadline">
              <strong>Deadline:</strong> {formatDateForDisplay(task.deadline)}
            </span>
          )}

          <span className="task-category">{task.category}</span>

          {task.date && <span className="task-date">{task.date}</span>}

          <button onClick={() => onDelete(task.id)} title="Remove">🗑️</button>

          <button
            className="sync-btn"
            onClick={handleSyncToCalendar}
            title={task.syncedToCalendar ? "Already synced to Google Calendar" : "Sync to Google Calendar"}
            disabled={syncing}
          >
            {syncing ? "⏳" : task.syncedToCalendar ? "✅" : "📅"}
          </button>

          {eatingTaskId === task.id && (
            <img src="/taskman-transparent.png" alt="Eating" className="dane-eat" />
          )}
        </>
      )}
    </li>
  );
}

export default TaskItem;
