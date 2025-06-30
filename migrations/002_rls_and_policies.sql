-- 002_rls_and_policies.sql
-- Enable RLS and add policies for all tables

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Example policies (repeat/adjust for each table as needed):

-- Projects: Only creator can view/modify
CREATE POLICY "Project view" ON projects
FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Project insert" ON projects
FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Project update" ON projects
FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Project delete" ON projects
FOR DELETE USING (created_by = auth.uid());

-- Project Discussions: Only project members (or creator) can view/modify
CREATE POLICY "Discussion view" ON project_discussions
FOR SELECT USING (
  created_by = auth.uid()
  OR project_id IN (SELECT id FROM projects WHERE created_by = auth.uid())
);
CREATE POLICY "Discussion insert" ON project_discussions
FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Discussion update" ON project_discussions
FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Discussion delete" ON project_discussions
FOR DELETE USING (created_by = auth.uid());

-- Tasks: Only assigned user or creator can view/modify
CREATE POLICY "Task view" ON tasks
FOR SELECT USING (
  assigned_to = auth.uid() OR created_by = auth.uid()
);
CREATE POLICY "Task insert" ON tasks
FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Task update" ON tasks
FOR UPDATE USING (
  assigned_to = auth.uid() OR created_by = auth.uid()
);
CREATE POLICY "Task delete" ON tasks
FOR DELETE USING (created_by = auth.uid());

-- Approvals: Only requester or assignees can view/modify
CREATE POLICY "Approval view" ON approvals
FOR SELECT USING (
  requester_id = auth.uid()
  OR id IN (SELECT approval_id FROM approval_assignees WHERE assignee_id = auth.uid())
);
CREATE POLICY "Approval insert" ON approvals
FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Approval update" ON approvals
FOR UPDATE USING (requester_id = auth.uid());
CREATE POLICY "Approval delete" ON approvals
FOR DELETE USING (requester_id = auth.uid());

-- Approval Assignees: Only assignee or requester can view/modify
CREATE POLICY "Approval assignee view" ON approval_assignees
FOR SELECT USING (
  assignee_id = auth.uid()
  OR approval_id IN (SELECT id FROM approvals WHERE requester_id = auth.uid())
);
CREATE POLICY "Approval assignee insert" ON approval_assignees
FOR INSERT WITH CHECK (assignee_id = auth.uid());
CREATE POLICY "Approval assignee update" ON approval_assignees
FOR UPDATE USING (assignee_id = auth.uid());
CREATE POLICY "Approval assignee delete" ON approval_assignees
FOR DELETE USING (assignee_id = auth.uid());

-- Documents: Only uploader or project members can view/modify
CREATE POLICY "Document view" ON documents
FOR SELECT USING (
  uploaded_by = auth.uid()
  OR project_id IN (SELECT id FROM projects WHERE created_by = auth.uid())
);
CREATE POLICY "Document insert" ON documents
FOR INSERT WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "Document update" ON documents
FOR UPDATE USING (uploaded_by = auth.uid());
CREATE POLICY "Document delete" ON documents
FOR DELETE USING (uploaded_by = auth.uid());

-- Chats: Only participants can view/modify
CREATE POLICY "Chat view" ON chats
FOR SELECT USING (
  id IN (SELECT chat_id FROM chat_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Chat insert" ON chats
FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Chat update" ON chats
FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Chat delete" ON chats
FOR DELETE USING (created_by = auth.uid());

-- Chat Participants: Only participant can view/modify
CREATE POLICY "Chat participant view" ON chat_participants
FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Chat participant insert" ON chat_participants
FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Chat participant update" ON chat_participants
FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Chat participant delete" ON chat_participants
FOR DELETE USING (user_id = auth.uid());

-- Messages: Only chat participants can view/modify
CREATE POLICY "Message view" ON messages
FOR SELECT USING (
  chat_id IN (SELECT chat_id FROM chat_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Message insert" ON messages
FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Message update" ON messages
FOR UPDATE USING (sender_id = auth.uid());
CREATE POLICY "Message delete" ON messages
FOR DELETE USING (sender_id = auth.uid());

-- Comments: Only author or entity members can view/modify
CREATE POLICY "Comment view" ON comments
FOR SELECT USING (
  author_id = auth.uid()
  OR task_id IN (SELECT id FROM tasks WHERE assigned_to = auth.uid() OR created_by = auth.uid())
  OR document_id IN (SELECT id FROM documents WHERE uploaded_by = auth.uid())
  OR discussion_id IN (SELECT id FROM project_discussions WHERE created_by = auth.uid())
);
CREATE POLICY "Comment insert" ON comments
FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Comment update" ON comments
FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Comment delete" ON comments
FOR DELETE USING (author_id = auth.uid());

-- Attachments: Only uploader or entity members can view/modify
CREATE POLICY "Attachment view" ON attachments
FOR SELECT USING (
  uploaded_by = auth.uid()
  OR task_id IN (SELECT id FROM tasks WHERE assigned_to = auth.uid() OR created_by = auth.uid())
  OR approval_id IN (SELECT id FROM approvals WHERE requester_id = auth.uid())
  OR discussion_id IN (SELECT id FROM project_discussions WHERE created_by = auth.uid())
  OR document_id IN (SELECT id FROM documents WHERE uploaded_by = auth.uid())
);
CREATE POLICY "Attachment insert" ON attachments
FOR INSERT WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "Attachment update" ON attachments
FOR UPDATE USING (uploaded_by = auth.uid());
CREATE POLICY "Attachment delete" ON attachments
FOR DELETE USING (uploaded_by = auth.uid());

-- Notification Preferences: Only the user can view/modify
CREATE POLICY "Notification prefs" ON notification_preferences
FOR SELECT, UPDATE, DELETE USING (user_id = auth.uid());
CREATE POLICY "Notification prefs insert" ON notification_preferences
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Audit Logs: Only the user (or admin) can view their logs; anyone can insert
CREATE POLICY "Audit log view" ON audit_logs
FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Audit log insert" ON audit_logs
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications: Only the user can view/modify
CREATE POLICY "Notification view" ON notifications
FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Notification insert" ON notifications
FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Notification update" ON notifications
FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Notification delete" ON notifications
FOR DELETE USING (user_id = auth.uid()); 