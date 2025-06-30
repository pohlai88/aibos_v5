-- 001_create_tables.sql
-- Table creation for all entities

-- 1. Projects
CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    created_by uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 2. Project Discussions
CREATE TABLE project_discussions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id) NOT NULL,
    title text NOT NULL,
    body text,
    created_by uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 3. Tasks
CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id),
    title text NOT NULL,
    description text,
    assigned_to uuid REFERENCES auth.users(id),
    status text CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
    due_date date,
    created_by uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 4. Documents
CREATE TABLE documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id),
    title text NOT NULL,
    description text,
    uploaded_by uuid REFERENCES auth.users(id) NOT NULL,
    file_url text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 5. Approvals
CREATE TABLE approvals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid REFERENCES tasks(id),
    document_id uuid REFERENCES documents(id),
    requester_id uuid REFERENCES auth.users(id) NOT NULL,
    status text CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz DEFAULT now()
);

-- 6. Approval Assignees
CREATE TABLE approval_assignees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_id uuid REFERENCES approvals(id) NOT NULL,
    assignee_id uuid REFERENCES auth.users(id) NOT NULL,
    status text CHECK (status IN ('pending', 'approved', 'rejected')),
    comment text,
    acted_at timestamptz,
    UNIQUE (approval_id, assignee_id)
);

-- 7. Chats
CREATE TABLE chats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    is_group boolean DEFAULT false,
    created_by uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 8. Chat Participants
CREATE TABLE chat_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id uuid REFERENCES chats(id) NOT NULL,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    UNIQUE (chat_id, user_id)
);

-- 9. Messages
CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id uuid REFERENCES chats(id) NOT NULL,
    sender_id uuid REFERENCES auth.users(id) NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 10. Comments
CREATE TABLE comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid REFERENCES comments(id),
    task_id uuid REFERENCES tasks(id),
    document_id uuid REFERENCES documents(id),
    discussion_id uuid REFERENCES project_discussions(id),
    author_id uuid REFERENCES auth.users(id) NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 11. Attachments
CREATE TABLE attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    file_url text NOT NULL,
    file_name text,
    uploaded_by uuid REFERENCES auth.users(id) NOT NULL,
    task_id uuid REFERENCES tasks(id),
    approval_id uuid REFERENCES approvals(id),
    discussion_id uuid REFERENCES project_discussions(id),
    document_id uuid REFERENCES documents(id),
    uploaded_at timestamptz DEFAULT now()
);

-- 12. Notification Preferences
CREATE TABLE notification_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
    chat_email boolean DEFAULT true,
    chat_realtime boolean DEFAULT true,
    approval_email boolean DEFAULT true,
    approval_realtime boolean DEFAULT true,
    document_email boolean DEFAULT true,
    document_realtime boolean DEFAULT true,
    updated_at timestamptz DEFAULT now()
);

-- 13. Audit Logs
CREATE TABLE audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    action text NOT NULL,
    entity_type text,
    entity_id uuid,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- 14. Notifications
CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    source_type text NOT NULL,
    source_id uuid NOT NULL,
    message text,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_discussions_project_id ON project_discussions(project_id);
CREATE INDEX idx_discussions_created_by ON project_discussions(created_by);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_approvals_task_id ON approvals(task_id);
CREATE INDEX idx_approvals_document_id ON approvals(document_id);
CREATE INDEX idx_approvals_requester_id ON approvals(requester_id);
CREATE INDEX idx_approval_assignees_approval_id ON approval_assignees(approval_id);
CREATE INDEX idx_approval_assignees_assignee_id ON approval_assignees(assignee_id);
CREATE INDEX idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_document_id ON comments(document_id);
CREATE INDEX idx_comments_discussion_id ON comments(discussion_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_attachments_task_id ON attachments(task_id);
CREATE INDEX idx_attachments_approval_id ON attachments(approval_id);
CREATE INDEX idx_attachments_discussion_id ON attachments(discussion_id);
CREATE INDEX idx_attachments_document_id ON attachments(document_id);
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id); 