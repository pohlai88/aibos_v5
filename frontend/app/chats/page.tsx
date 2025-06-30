"use client";
import { useEffect, useState } from "react";

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    setChats([
      { id: 1, name: "General" },
      { id: 2, name: "Project Alpha" },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Chats</h1>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-2 p-2 bg-white rounded shadow">
            <span className="font-semibold">{chat.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
