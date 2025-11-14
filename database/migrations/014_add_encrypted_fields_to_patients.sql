-- Add encrypted_fields JSONB column to patients to store sensitive JSON (insurance, etc.)
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS encrypted_fields JSONB;
