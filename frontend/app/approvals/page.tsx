"use client";

import { useEffect, useState } from "react";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    setApprovals([
      { id: 1, title: "Expense Report Q2", status: "pending" },
      { id: 2, title: "Document Upload", status: "approved" },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Approvals</h1>
      <ul>
        {approvals.map((approval) => (
          <li key={approval.id} className="mb-2 p-2 bg-white rounded shadow">
            <span className="font-semibold">{approval.title}</span>{" "}
            <span className="text-gray-500">({approval.status})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
