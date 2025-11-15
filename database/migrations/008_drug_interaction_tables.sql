-- Drug Interaction Database
CREATE TABLE drugs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_name VARCHAR(255) UNIQUE NOT NULL,
  generic_name VARCHAR(255),
  drug_class VARCHAR(100),
  side_effects TEXT[],
  contraindications TEXT[],
  dosage_range VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drugs_name ON drugs(drug_name);
CREATE INDEX idx_drugs_generic ON drugs(generic_name);

-- Drug Interactions
CREATE TABLE drug_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug1_id UUID NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  drug2_id UUID NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  interaction_severity VARCHAR(50), -- 'mild', 'moderate', 'severe', 'contraindicated'
  interaction_description TEXT,
  management_advice TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(drug1_id, drug2_id)
);

CREATE INDEX idx_drug_interactions_drug1 ON drug_interactions(drug1_id);
CREATE INDEX idx_drug_interactions_drug2 ON drug_interactions(drug2_id);

-- Drug Checks Log
CREATE TABLE drug_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medication_list TEXT[],
  interactions_found INT,
  severity_level VARCHAR(50),
  check_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drug_checks_patient ON drug_checks(patient_id);
