"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface Approval {
  id: string;
  task_id: string | null;
  document_id: string | null;
  requester_id: string;
  status: string;
  created_at: string;
}

interface ApprovalAssignee {
  id: string;
  approval_id: string;
  assignee_id: string;
  status: string;
  comment: string | null;
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
}

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export default function ApprovalDetailPage() {
  const params = useParams();
  const approvalId = params.id as string;

  const [approval, setApproval] = useState<Approval | null>(null);
  const [assignees, setAssignees] = useState<ApprovalAssignee[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [approvalComment, setApprovalComment] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchApproval();
    fetchAssignees();
    fetchComments();
    fetchAttachments();
    subscribeToChanges();
  }, [approvalId]);

  async function fetchApproval() {
    const { data, error } = await getSupabaseClient()
      .from("approvals")
      .select("*")
      .eq("id", approvalId)
      .single();

    if (error) {
      console.error("Error fetching approval:", error);
      return;
    }

    if (data) {
      setApproval(data as unknown as Approval);
    }
  }

  async function fetchAssignees() {
    const { data, error } = await getSupabaseClient()
      .from("approval_assignees")
      .select("*")
      .eq("approval_id", approvalId);

    if (error) {
      console.error("Error fetching assignees:", error);
      return;
    }

    if (data) {
      setAssignees(data as unknown as ApprovalAssignee[]);
    }
  }

  async function fetchComments() {
    const { data, error } = await getSupabaseClient()
      .from("comments")
      .select("*")
      .eq("approval_id", approvalId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    if (data) {
      setComments(data as unknown as Comment[]);
    }
  }

  async function fetchAttachments() {
    const { data, error } = await getSupabaseClient()
      .from("attachments")
      .select("*")
      .eq("approval_id", approvalId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Error fetching attachments:", error);
      return;
    }

    if (data) {
      setAttachments(data as unknown as Attachment[]);
    }
  }

  function subscribeToChanges() {
    // Subscribe to approval status changes
    const approvalSubscription = getSupabaseClient()
      .channel("approval_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "approvals",
          filter: `id=eq.${approvalId}`,
        },
        () => {
          fetchApproval();
        }
      )
      .subscribe();

    // Subscribe to assignee status changes
    const assigneeSubscription = getSupabaseClient()
      .channel("assignee_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "approval_assignees",
          filter: `approval_id=eq.${approvalId}`,
        },
        () => {
          fetchAssignees();
        }
      )
      .subscribe();

    // Subscribe to new comments
    const commentSubscription = getSupabaseClient()
      .channel("approval_comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `approval_id=eq.${approvalId}`,
        },
        (payload) => {
          setComments((current) => [...current, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => {
      approvalSubscription.unsubscribe();
      assigneeSubscription.unsubscribe();
      commentSubscription.unsubscribe();
    };
  }

  async function handleApprove() {
    const user = (await getSupabaseClient().auth.getUser()).data.user;
    if (!user) return;

    const { error } = await getSupabaseClient()
      .from("approval_assignees")
      .update({
        status: "approved",
        comment: approvalComment,
      })
      .eq("approval_id", approvalId)
      .eq("assignee_id", user.id);

    if (error) {
      console.error("Error approving:", error);
      return;
    }

    // Add a comment about the approval
    await getSupabaseClient()
      .from("comments")
      .insert([
        {
          approval_id: approvalId,
          content: `Approved${approvalComment ? `: ${approvalComment}` : ""}`,
          author_id: user.id,
        },
      ]);

    setApprovalComment("");
  }

  async function handleReject() {
    const user = (await getSupabaseClient().auth.getUser()).data.user;
    if (!user) return;

    const { error } = await getSupabaseClient()
      .from("approval_assignees")
      .update({
        status: "rejected",
        comment: approvalComment,
      })
      .eq("approval_id", approvalId)
      .eq("assignee_id", user.id);

    if (error) {
      console.error("Error rejecting:", error);
      return;
    }

    // Add a comment about the rejection
    await getSupabaseClient()
      .from("comments")
      .insert([
        {
          approval_id: approvalId,
          content: `Rejected${approvalComment ? `: ${approvalComment}` : ""}`,
          author_id: user.id,
        },
      ]);

    setApprovalComment("");
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = (await getSupabaseClient().auth.getUser()).data.user;
    if (!user) return;

    const { error } = await getSupabaseClient()
      .from("comments")
      .insert([
        {
          approval_id: approvalId,
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
      const user = (await getSupabaseClient().auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await getSupabaseClient()
        .storage.from("attachments")
        .upload(`approval-${approvalId}/${file.name}`, file);

      if (uploadError) throw uploadError;

      // Create attachment record
      const { error: attachmentError } = await getSupabaseClient()
        .from("attachments")
        .insert([
          {
            approval_id: approvalId,
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

  if (!approval) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Approval Status */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Approval Request</h1>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded ${
                approval.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : approval.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {approval.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(approval.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Assignees */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Approvers</h2>
          <div className="space-y-2">
            {assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="p-3 bg-gray-50 rounded flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{assignee.assignee_id}</span>
                  {assignee.comment && (
                    <p className="text-sm text-gray-600 mt-1">
                      {assignee.comment}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded ${
                    assignee.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : assignee.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {assignee.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Actions */}
        <div className="border-t pt-4">
          <textarea
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
            placeholder="Add a comment with your decision..."
            className="w-full p-2 border rounded mb-4"
            rows={2}
          />
          <div className="flex space-x-4">
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4 mb-4">
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
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                  const { data } = await getSupabaseClient()
                    .storage.from("attachments")
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
          />
          {uploading && (
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
