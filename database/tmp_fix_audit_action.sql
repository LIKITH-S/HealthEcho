CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, status, timestamp)
  VALUES (
    CASE
      WHEN current_setting('app.current_user_id', true) IS NULL OR current_setting('app.current_user_id', true) = '' THEN NULL
      ELSE current_setting('app.current_user_id')::UUID
    END,
    COALESCE(TG_ARGV[0], TG_OP),
    TG_TABLE_NAME,
    NEW.id,
    'success',
    CURRENT_TIMESTAMP
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
