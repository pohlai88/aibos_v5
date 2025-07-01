"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    getSupabaseClient()
      .auth.getUser()
      .then(({ data }) => setUser(data?.user));
    // Dummy data for now
    setProjects([
      { id: 1, name: "Project Alpha" },
      { id: 2, name: "Project Beta" },
    ]);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
      <h2 className="text-xl font-semibold mb-2">Your Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id} className="mb-1">
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
