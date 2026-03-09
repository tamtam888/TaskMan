import React, { useState } from "react";

function CalendarSync({ tasks, accessToken }) {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    if (!accessToken) {
      setError("No Google connection.");
      return;
    }

    const tasksWithDeadline = tasks.filter(
      (task) => task.deadline && !task.completed
    );

    if (tasksWithDeadline.length === 0) {
      setError("No tasks with a deadline to sync.");
      return;
    }

    setSyncing(true);
    setError(null);
    setSyncStatus(null);

    let successCount = 0;
    let failedCount = 0;

    for (const task of tasksWithDeadline) {
      try {
        await addTaskToCalendar(task, accessToken);
        successCount++;
      } catch (err) {
        failedCount++;
        console.error(task.text, err.message);
      }
    }

    setSyncing(false);
    setSyncStatus({
      success: successCount,
      failed: failedCount,
      total: tasksWithDeadline.length,
    });
  };

  return (
    <div>
      <button onClick={handleSync} disabled={syncing || !accessToken}>
        {syncing ? "Syncing..." : "Sync Tasks to Calendar"}
      </button>

      {syncStatus && (
        <div>
          Synced {syncStatus.success} of {syncStatus.total} tasks
          {syncStatus.failed > 0 && ` (${syncStatus.failed} failed)`}
        </div>
      )}

      {error && <div>{error}</div>}

      {!accessToken && <div>Please login with Google to sync calendar.</div>}
    </div>
  );
}

async function addTaskToCalendar(task, accessToken) {
  const deadlineDate = new Date(task.deadline);
  const dateString = deadlineDate.toISOString().split("T")[0];

  const event = {
    summary: `${task.text}`,
    description: buildDescription(task),
    start: { date: dateString },
    end: { date: dateString },
    attendees:
      task.participants && task.participants.length > 0
        ? task.participants.map((email) => ({
            email: email.trim(),
            responseStatus: "needsAction",
          }))
        : undefined,
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 0 }],
    },
    colorId: getPriorityColor(task.priority),
  };

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all",
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

  return await response.json();
}

function buildDescription(task) {
  let description = "Task from TaskMan\n\n";
  if (task.priority) description += `Priority: ${task.priority}\n`;
  if (task.category) description += `Category: ${task.category}\n`;
  if (task.participants && task.participants.length > 0) {
    description += `Participants: ${task.participants.join(", ")}\n`;
  }
  return description;
}

function getPriorityColor(priority) {
  const colorMap = { High: "11", Normal: "5", Low: "9" };
  return colorMap[priority] || "5";
}

export default CalendarSync;
