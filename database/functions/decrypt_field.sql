-- Decrypt a field using provided key (placeholder)
CREATE OR REPLACE FUNCTION decrypt_field(p_text text, p_key text)
RETURNS text AS $$
BEGIN
  RETURN p_text;
END;
$$ LANGUAGE plpgsql;
