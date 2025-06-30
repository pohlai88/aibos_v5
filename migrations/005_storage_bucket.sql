-- 005_storage_bucket.sql
-- Create and configure storage bucket for attachments

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('attachments', 'attachments')
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated upload"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'attachments');

-- Allow users to view files they have access to
CREATE POLICY "Allow authorized download"
ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'attachments'
  AND (
    -- File is linked to a task the user has access to
    EXISTS (
      SELECT 1 FROM attachments a
      JOIN tasks t ON a.task_id = t.id
      WHERE storage.objects.name = a.file_url
      AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid())
    )
    -- Or file is linked to a document the user has access to
    OR EXISTS (
      SELECT 1 FROM attachments a
      JOIN documents d ON a.document_id = d.id
      WHERE storage.objects.name = a.file_url
      AND (d.uploaded_by = auth.uid())
    )
    -- Or file is linked to an approval the user has access to
    OR EXISTS (
      SELECT 1 FROM attachments a
      JOIN approvals ap ON a.approval_id = ap.id
      WHERE storage.objects.name = a.file_url
      AND (ap.requester_id = auth.uid()
           OR EXISTS (
             SELECT 1 FROM approval_assignees aa
             WHERE aa.approval_id = ap.id
             AND aa.assignee_id = auth.uid()
           ))
    )
  )
);

-- Allow users to delete their own uploads
CREATE POLICY "Allow delete own files"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'attachments'
  AND EXISTS (
    SELECT 1 FROM attachments a
    WHERE storage.objects.name = a.file_url
    AND a.uploaded_by = auth.uid()
  )
); 