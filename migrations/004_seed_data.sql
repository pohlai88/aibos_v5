-- 004_seed_data.sql
-- Seed data for testing and development

-- Users are managed by Supabase Auth, but we'll note the UUIDs here for reference
/*
User UUIDs will be provided by Supabase Auth:
1. john@example.com
2. alice@example.com
3. bob@example.com
4. sarah@example.com
5. mike@example.com
6. lisa@example.com
7. david@example.com
8. emma@example.com
9. james@example.com
10. anna@example.com
*/

-- Projects
INSERT INTO projects (id, name, description, created_by) VALUES
('11111111-1111-1111-1111-111111111111', 'Marketing Campaign 2024', 'Q1 marketing initiatives', 'USER_1_UUID'),
('22222222-2222-2222-2222-222222222222', 'Product Launch', 'New product release planning', 'USER_2_UUID'),
('33333333-3333-3333-3333-333333333333', 'Website Redesign', 'Company website overhaul', 'USER_3_UUID'),
('44444444-4444-4444-4444-444444444444', 'Customer Support Portal', 'Internal support dashboard', 'USER_4_UUID'),
('55555555-5555-5555-5555-555555555555', 'Mobile App Development', 'iOS and Android apps', 'USER_5_UUID');

-- Tasks
INSERT INTO tasks (id, project_id, title, description, assigned_to, status, due_date, created_by) VALUES
('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Design social media templates', 'Create templates for Facebook and Instagram', 'USER_1_UUID', 'in_progress', '2024-07-01', 'USER_2_UUID'),
('aaaaaaaa-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Write blog posts', 'Content creation for Q1', 'USER_3_UUID', 'pending', '2024-07-15', 'USER_2_UUID'),
('aaaaaaaa-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Product specs review', 'Review and approve specifications', 'USER_4_UUID', 'completed', '2024-06-30', 'USER_5_UUID'),
-- Add more tasks...

-- Documents
INSERT INTO documents (id, project_id, title, description, uploaded_by, file_url) VALUES
('dddddddd-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Marketing Plan.pdf', 'Q1 2024 Marketing Strategy', 'USER_1_UUID', 'https://example.com/files/marketing-plan.pdf'),
('dddddddd-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Product Specs.docx', 'Technical specifications', 'USER_2_UUID', 'https://example.com/files/product-specs.docx'),
-- Add more documents...

-- Approvals
INSERT INTO approvals (id, task_id, document_id, requester_id, status) VALUES
('bbbbbbbb-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111', NULL, 'USER_1_UUID', 'pending'),
('bbbbbbbb-2222-2222-2222-222222222222', NULL, 'dddddddd-1111-1111-1111-111111111111', 'USER_2_UUID', 'approved'),
-- Add more approvals...

-- Approval Assignees
INSERT INTO approval_assignees (approval_id, assignee_id, status, comment) VALUES
('bbbbbbbb-1111-1111-1111-111111111111', 'USER_3_UUID', 'pending', NULL),
('bbbbbbbb-2222-2222-2222-222222222222', 'USER_4_UUID', 'approved', 'Looks good!'),
-- Add more assignees...

-- Chats
INSERT INTO chats (id, name, is_group, created_by) VALUES
('cccccccc-1111-1111-1111-111111111111', 'Marketing Team', true, 'USER_1_UUID'),
('cccccccc-2222-2222-2222-222222222222', NULL, false, 'USER_2_UUID'),
-- Add more chats...

-- Chat Participants
INSERT INTO chat_participants (chat_id, user_id) VALUES
('cccccccc-1111-1111-1111-111111111111', 'USER_1_UUID'),
('cccccccc-1111-1111-1111-111111111111', 'USER_2_UUID'),
('cccccccc-1111-1111-1111-111111111111', 'USER_3_UUID'),
('cccccccc-2222-2222-2222-222222222222', 'USER_2_UUID'),
('cccccccc-2222-2222-2222-222222222222', 'USER_4_UUID'),
-- Add more participants...

-- Messages
INSERT INTO messages (chat_id, sender_id, content) VALUES
('cccccccc-1111-1111-1111-111111111111', 'USER_1_UUID', 'Hey team, quick update on the marketing campaign...'),
('cccccccc-1111-1111-1111-111111111111', 'USER_2_UUID', 'Thanks for the update! Looking good.'),
('cccccccc-2222-2222-2222-222222222222', 'USER_2_UUID', 'Hi, can you review the latest design?'),
-- Add more messages...

-- Comments
INSERT INTO comments (task_id, document_id, author_id, content) VALUES
('aaaaaaaa-1111-1111-1111-111111111111', NULL, 'USER_1_UUID', 'Started working on the templates'),
('aaaaaaaa-1111-1111-1111-111111111111', NULL, 'USER_2_UUID', 'Great! Let me know if you need any help'),
-- Add more comments...

-- Notifications
INSERT INTO notifications (user_id, source_type, source_id, message) VALUES
('USER_1_UUID', 'task', 'aaaaaaaa-1111-1111-1111-111111111111', 'New task assigned: Design social media templates'),
('USER_2_UUID', 'approval', 'bbbbbbbb-1111-1111-1111-111111111111', 'Your approval is requested'),
-- Add more notifications...

-- Notification Preferences (for each user)
INSERT INTO notification_preferences (user_id) VALUES
('USER_1_UUID'),
('USER_2_UUID'),
('USER_3_UUID'),
('USER_4_UUID'),
('USER_5_UUID'); 