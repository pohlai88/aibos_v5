"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Notification {
  id: string;
  user_id: string;
  message: string;
  source_type: string;
  source_id: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    subscribeToNotifications();
  }, []);

  async function fetchNotifications() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    setNotifications(data);
    setLoading(false);
  }

  function subscribeToNotifications() {
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          setNotifications((current) => [
            payload.new as Notification,
            ...current,
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  async function markAsRead(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return;
    }

    setNotifications((current) =>
      current.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
  }

  async function markAllAsRead() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return;
    }

    setNotifications((current) =>
      current.map((n) => ({ ...n, is_read: true }))
    );
  }

  function getNotificationIcon(sourceType: string) {
    switch (sourceType) {
      case "task":
        return "📋";
      case "approval":
        return "✅";
      case "chat":
        return "💬";
      case "document":
        return "📄";
      default:
        return "🔔";
    }
  }

  function getNotificationLink(notification: Notification) {
    switch (notification.source_type) {
      case "task":
        return `/tasks/${notification.source_id}`;
      case "approval":
        return `/approvals/${notification.source_id}`;
      case "chat":
        return `/chats/${notification.source_id}`;
      case "document":
        return `/documents/${notification.source_id}`;
      default:
        return "#";
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={markAllAsRead}
              className="text-blue-500 hover:text-blue-600"
              data-cy="mark-all-read"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4" data-cy="notifications-list">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No notifications yet
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.is_read
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
                data-cy={
                  notification.is_read
                    ? "read-notification"
                    : "unread-notification"
                }
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.source_type)}
                  </div>
                  <div className="flex-1">
                    <a
                      href={getNotificationLink(notification)}
                      className="block hover:text-blue-600"
                    >
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </a>
                  </div>
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm text-blue-500 hover:text-blue-600"
                      data-cy="mark-read-button"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
