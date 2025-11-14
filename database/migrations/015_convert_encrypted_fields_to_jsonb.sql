-- Convert patients.encrypted_fields from TEXT[] to JSONB
-- This converts existing array values into JSON arrays; if encrypted_fields contains
-- stringified JSON objects, consider adjusting the USING expression accordingly.
ALTER TABLE patients
ALTER COLUMN encrypted_fields TYPE JSONB USING to_jsonb(encrypted_fields);
