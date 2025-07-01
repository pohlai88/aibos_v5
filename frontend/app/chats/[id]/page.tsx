"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ChatParticipant {
  id: string;
  user_id: string;
  chat_id: string;
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser();
    fetchMessages();
    fetchParticipants();
    subscribeToMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchMessages() {
    const { data, error } = await getSupabaseClient()
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    if (data) {
      setMessages(data as unknown as Message[]);
    }
  }

  async function getCurrentUser() {
    const {
      data: { user },
    } = await getSupabaseClient().auth.getUser();
    setCurrentUser(user);
  }

  async function fetchParticipants() {
    const { data, error } = await getSupabaseClient()
      .from("chat_participants")
      .select("*")
      .eq("chat_id", chatId);

    if (error) {
      console.error("Error fetching participants:", error);
      return;
    }

    if (data) {
      setParticipants(data as unknown as any[]);
    }
  }

  function subscribeToMessages() {
    const subscription = getSupabaseClient()
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    const user = (await getSupabaseClient().auth.getUser()).data.user;
    if (!user) return;

    const { error } = await getSupabaseClient()
      .from("messages")
      .insert([
        {
          chat_id: chatId,
          content: newMessage,
          sender_id: user.id,
        },
      ]);

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    setNewMessage("");
    setSending(false);
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold">
          Chat ({participants.length} participants)
        </h1>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        data-cy="messages-list"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUser?.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender_id === currentUser?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white shadow-top">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
            disabled={sending}
            data-cy="message-input"
          />
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            data-cy="send-message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
