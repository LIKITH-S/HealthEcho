-- Drug interaction database seed (placeholder)
-- Insert common interactions here

---

### **drug_interaction_database.sql**
``````sql
-- Common drug interaction database for HealthEcho

INSERT INTO drug_interactions (drug_1, drug_2, severity, interaction_description, recommendation)
VALUES
  ('Aspirin', 'Warfarin', 'high', 'Increases bleeding risk', 'Monitor INR closely, consider alternative'),
  ('Metformin', 'Contrast Dye', 'high', 'Risk of lactic acidosis', 'Discontinue 48 hours before procedure'),
  ('Lisinopril', 'Potassium', 'high', 'Hyperkalemia risk', 'Monitor potassium levels regularly'),
  ('Amoxicillin', 'Oral Contraceptives', 'moderate', 'Reduced contraceptive efficacy', 'Use backup contraception'),
  ('Ibuprofen', 'Lisinopril', 'moderate', 'Reduced ACE inhibitor effectiveness', 'Consider alternative pain relief'),
  ('Acetaminophen', 'Alcohol', 'moderate', 'Increased liver toxicity risk', 'Limit alcohol consumption'),
  ('Simvastatin', 'Grapefruit Juice', 'moderate', 'Increased statin levels', 'Avoid grapefruit products'),
  ('Metoprolol', 'Verapamil', 'high', 'Severe bradycardia/heart block risk', 'Avoid combination or use with caution'),
  ('Fluconazole', 'Warfarin', 'high', 'Increased INR', 'Monitor INR, adjust warfarin dose'),
  ('Cimetidine', 'Theophylline', 'moderate', 'Increased theophylline levels', 'Reduce theophylline dose');
