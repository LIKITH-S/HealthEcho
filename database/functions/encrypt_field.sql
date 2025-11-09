-- Encrypt a field using provided key (placeholder)
-- In production, use KMS and never pass raw keys via SQL.
CREATE OR REPLACE FUNCTION encrypt_field(p_text text, p_key text)
RETURNS text AS $$
BEGIN
  -- Placeholder: use pgcrypto or call external vault
  RETURN p_text;
END;
$$ LANGUAGE plpgsql;
