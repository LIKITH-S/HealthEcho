-- Function to log audit events automatically
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, status, timestamp)
  VALUES (
    CASE
      WHEN current_setting('app.current_user_id', true) IS NULL OR current_setting('app.current_user_id', true) = '' THEN NULL
      ELSE current_setting('app.current_user_id')::UUID
    END,
    TG_ARGV[0],
    TG_TABLE_NAME,
    NEW.id,
    'success',
    CURRENT_TIMESTAMP
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for audit logging on key tables
CREATE TRIGGER audit_users_change
AFTER INSERT OR UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_medical_reports_change
AFTER INSERT OR UPDATE ON medical_reports
FOR EACH ROW EXECUTE FUNCTION log_audit_event();
