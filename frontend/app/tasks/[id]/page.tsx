"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  assigned_to: string;
  created_by: string;
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  parent_id: string | null;
}

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTask();
    fetchComments();
    fetchAttachments();
    subscribeToComments();
  }, [taskId]);

  async function fetchTask() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) {
      console.error("Error fetching task:", error);
      return;
    }

    setTask(data);
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    setComments(data);
  }

  async function fetchAttachments() {
    const { data, error } = await supabase
      .from("attachments")
      .select("*")
      .eq("task_id", taskId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Error fetching attachments:", error);
      return;
    }

    setAttachments(data);
  }

  function subscribeToComments() {
    const subscription = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          setComments((current) => [...current, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { error } = await supabase.from("comments").insert([
      {
        task_id: taskId,
        content: newComment,
        author_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error posting comment:", error);
      return;
    }

    setNewComment("");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(`task-${taskId}/${file.name}`, file);

      if (uploadError) throw uploadError;

      // Create attachment record
      const { error: attachmentError } = await supabase
        .from("attachments")
        .insert([
          {
            task_id: taskId,
            file_name: file.name,
            file_url: fileData.path,
            uploaded_by: user.id,
          },
        ]);

      if (attachmentError) throw attachmentError;

      // Refresh attachments list
      fetchAttachments();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  }

  if (!task) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4" data-cy="task-title">
          {task.title}
        </h1>
        <p className="text-gray-600 mb-4" data-cy="task-description">
          {task.description}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Status:</span> {task.status}
          </div>
          <div>
            <span className="font-semibold">Due Date:</span>{" "}
            {new Date(task.due_date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4 mb-4" data-cy="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-gray-50 rounded">
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            rows={3}
            data-cy="comment-input"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            data-cy="submit-comment"
          >
            Post Comment
          </button>
        </form>
      </div>

      {/* Attachments Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Attachments</h2>
        <div className="space-y-2 mb-4">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span>{attachment.file_name}</span>
              <button
                onClick={async () => {
                  const { data } = await supabase.storage
                    .from("attachments")
                    .createSignedUrl(attachment.file_url, 60);
                  if (data) window.open(data.signedUrl);
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                Download
              </button>
            </div>
          ))}
        </div>
        <div>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            data-cy="file-input"
          />
          {uploading && (
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
