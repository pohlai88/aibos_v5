"use client";

import { useEffect, useState } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    setTasks([
      { id: 1, title: "Finish dashboard UI", status: "in_progress" },
      { id: 2, title: "Review approval workflow", status: "pending" },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 p-2 bg-white rounded shadow">
            <span className="font-semibold">{task.title}</span>{" "}
            <span className="text-gray-500">({task.status})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
