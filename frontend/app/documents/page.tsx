"use client";

import { useEffect, useState } from "react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    setDocuments([
      { id: 1, title: "Employee Handbook.pdf" },
      { id: 2, title: "Q2 Financials.xlsx" },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id} className="mb-2 p-2 bg-white rounded shadow">
            <span className="font-semibold">{doc.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
