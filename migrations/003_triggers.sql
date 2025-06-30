-- 003_triggers.sql
-- Audit logging triggers for tasks and comments

-- TASKS AUDIT LOG TRIGGER
CREATE OR REPLACE FUNCTION log_task_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (NEW.created_by, 'create', 'task', NEW.id, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (NEW.created_by, 'update', 'task', NEW.id, json_build_object('before', row_to_json(OLD), 'after', row_to_json(NEW)));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (OLD.created_by, 'delete', 'task', OLD.id, row_to_json(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_audit
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION log_task_changes();

-- COMMENTS AUDIT LOG TRIGGER
CREATE OR REPLACE FUNCTION log_comment_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (NEW.author_id, 'create', 'comment', NEW.id, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (NEW.author_id, 'update', 'comment', NEW.id, json_build_object('before', row_to_json(OLD), 'after', row_to_json(NEW)));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (OLD.author_id, 'delete', 'comment', OLD.id, row_to_json(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_audit
AFTER INSERT OR UPDATE OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION log_comment_changes();

-- MENTION NOTIFICATION TRIGGER FOR COMMENTS
CREATE OR REPLACE FUNCTION notify_mentions_in_comments()
RETURNS TRIGGER AS $$
DECLARE
  mentioned text[];
  username text;
  mentioned_user_id uuid;
BEGIN
  -- Extract all @mentions (simple regex for @username)
  mentioned := regexp_matches(NEW.content, '@([a-zA-Z0-9_]+)', 'g');
  IF mentioned IS NOT NULL THEN
    FOREACH username IN ARRAY mentioned LOOP
      -- Look up user by username (assuming usernames are unique and stored in user_metadata)
      SELECT id INTO mentioned_user_id FROM auth.users WHERE raw_user_meta_data->>'username' = username;
      IF mentioned_user_id IS NOT NULL AND mentioned_user_id <> NEW.author_id THEN
        INSERT INTO notifications (user_id, source_type, source_id, message)
        VALUES (mentioned_user_id, 'comment', NEW.id, 'You were mentioned in a comment.');
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_mentions
AFTER INSERT ON comments
FOR EACH ROW EXECUTE FUNCTION notify_mentions_in_comments(); 