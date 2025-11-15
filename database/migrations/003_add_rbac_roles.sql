-- Already included in 001_initial_schema.sql as roles table
-- This file can be used for role updates or additional role management

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(
  p_user_id UUID,
  p_permission TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_role user_role;
  v_permissions TEXT[];
BEGIN
  SELECT role INTO v_role FROM users WHERE id = p_user_id;
  SELECT permissions INTO v_permissions FROM roles WHERE role_name = v_role;
  RETURN p_permission = ANY(v_permissions);
END;
$$ LANGUAGE plpgsql;
