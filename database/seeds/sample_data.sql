-- Sample patients and basic users

INSERT INTO users (name, email, password, role)
VALUES 
  ('Alice Patient', 'alice.patient@example.com', '$2b$10$qPqhEzOAr3H2bg/1d47xOufA1KXobCeDCJozb2Mi5I0ZGnohXWL4K', 'patient'),
  ('Bob Patient', 'bob.patient@example.com', '$2b$10$qPqhEzOAr3H2bg/1d47xOufA1KXobCeDCJozb2Mi5I0ZGnohXWL4K', 'patient');
-- Password is 'TestPass123!' (bcrypt hash)
