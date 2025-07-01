"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
  uploaded_by: string;
  created_at: string;
  project_id: string;
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

export default function DocumentDetailPage() {
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchDocument();
    fetchComments();
    fetchAttachments();
    subscribeToComments();
  }, [documentId]);

  async function fetchDocument() {
    const { data, error } = await getSupabaseClient()
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) {
      console.error("Error fetching document:", error);
      return;
    }

    if (data) {
      setDocument(data as unknown as Document);
      generateDownloadUrl((data as unknown as Document).file_url);
    }
  }

  async function generateDownloadUrl(fileUrl: string) {
    const { data, error } = await getSupabaseClient()
      .storage.from("attachments")
      .createSignedUrl(fileUrl, 3600); // 1 hour expiry

    if (error) {
      console.error("Error generating download URL:", error);
      return;
    }

    setDownloadUrl(data.signedUrl);
  }

  async function fetchComments() {
    const { data, error } = await getSupabaseClient()
      .from("comments")
      .select("*")
      .eq("document_id", documentId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    if (data) {
      setComments(data as unknown as any[]);
    }
  }

  async function fetchAttachments() {
    const { data, error } = await getSupabaseClient()
      .from("attachments")
      .select("*")
      .eq("document_id", documentId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Error fetching attachments:", error);
      return;
    }

    if (data) {
      setAttachments(data as unknown as any[]);
    }
  }

  function subscribeToComments() {
    const subscription = getSupabaseClient()
      .channel("document_comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `document_id=eq.${documentId}`,
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
    const user = (await getSupabaseClient().auth.getUser()).data.user;
    if (!user) return;

    const { error } = await getSupabaseClient()
      .from("comments")
      .insert([
        {
          document_id: documentId,
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
        .upload(`document-${documentId}/${file.name}`, file);

      if (uploadError) throw uploadError;

      // Create attachment record
      const { error: attachmentError } = await getSupabaseClient()
        .from("attachments")
        .insert([
          {
            document_id: documentId,
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

  if (!document) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Document Details */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4" data-cy="document-title">
          {document.title}
        </h1>
        <p className="text-gray-600 mb-6" data-cy="document-description">
          {document.description}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="font-semibold">Uploaded by:</span>{" "}
            {document.uploaded_by}
          </div>
          <div>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(document.created_at).toLocaleDateString()}
          </div>
        </div>
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            data-cy="download-document"
          >
            Download Document
          </a>
        )}
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

      {/* Related Attachments */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Related Attachments</h2>
        <div className="space-y-2 mb-4" data-cy="attachments-list">
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
                data-cy="download-attachment"
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
