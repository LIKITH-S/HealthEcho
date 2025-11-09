-- Get emergency contacts for a patient (placeholder)
CREATE OR REPLACE FUNCTION getPatientEmergencyContacts(p_patient_id integer)
RETURNS TABLE(contact_id integer, name text, phone text) AS $$
BEGIN
  RETURN QUERY SELECT 0, 'Placeholder', '0000000000'::text;
END;
$$ LANGUAGE plpgsql;
