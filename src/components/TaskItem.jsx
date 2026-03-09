import React, { useState } from "react";
import "./TaskItem.css";
import { sanitizeText, auditSanitize } from "../security/sanitize";

const GCalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="gcal-icon">
    <rect x="1" y="2" width="16" height="15" rx="2" fill="white" stroke="#DADCE0" strokeWidth="1.2"/>
    <rect x="1" y="2" width="16" height="5.5" rx="2" fill="#4285F4"/>
    <rect x="1" y="5.5" width="16" height="2" fill="#4285F4"/>
    <line x1="5" y1="0.5" x2="5" y2="3.5" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="13" y1="0.5" x2="13" y2="3.5" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
    <text x="9" y="15" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#4285F4" fontFamily="Arial,sans-serif">31</text>
  </svg>
);

function TaskItem({ task, onToggle, onDelete, eatingTaskId, onEdit, calendarToken, onRequestCalendarAccess }) {

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("/")) return dateString;
    const [year, month, day] = (dateString || "").split("-");
    return `${day}/${month}/${year}`;
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

    const sanitizedText = sanitizeText(editedText);
    auditSanitize("task text", editedText, sanitizedText);

    const usersArray =
      editedUsers.trim() === ""
        ? []
        : editedUsers.split(",").map((u) => sanitizeText(u.trim())).filter(Boolean);

    const updatedTask = {
      ...task,
      text: sanitizedText,
      deadline: editedDeadline,
      priority: editedPriority,
      users: usersArray,
      participants: usersArray.join(", "),
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
    if (!task.deadline) {
      alert("Task needs a deadline to sync to calendar");
      return;
    }

    if (task.syncedToCalendar) {
      window.open("https://calendar.google.com", "_blank", "noopener,noreferrer");
      return;
    }

    if (!calendarToken) {
      onRequestCalendarAccess();
      alert("Please grant calendar access in the popup, then click the calendar icon again.");
      return;
    }

    setSyncing(true);

    // Open the tab immediately on user click (before async), so Chrome allows it
    const calendarTab = window.open("", "_blank");

    try {
      let deadlineDate;
      if (task.deadline.includes("/")) {
        const [day, month, year] = task.deadline.split("/");
        deadlineDate = new Date(year, month - 1, day, 9, 0, 0);
      } else {
        deadlineDate = new Date(task.deadline + "T09:00:00");
      }
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
            Authorization: `Bearer ${calendarToken}`,
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

      if (calendarTab) calendarTab.location.href = "https://calendar.google.com";

    } catch (error) {
      if (calendarTab) calendarTab.close();
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
            <button onClick={handleSave} title="Save changes">✅</button>
            <button onClick={() => setIsEditing(false)} title="Cancel edit">❌</button>
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
            {syncing ? "⏳" : task.syncedToCalendar ? "✅" : <GCalIcon />}
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
