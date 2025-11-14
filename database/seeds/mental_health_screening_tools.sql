-- PHQ-9 and GAD-7 question sets (placeholder)
-- Add questionnaire definitions here
-- Mental health assessment tools and screening questionnaires

INSERT INTO mental_health_screening_tools (tool_name, tool_type, total_questions, score_range, interpretation)
VALUES
('PHQ-9', 'Depression Screening', 9, '0-27', 'None=0-4, Mild=5-9, Moderate=10-14, Moderately Severe=15-19, Severe=20-27'),
('GAD-7', 'Anxiety Screening', 7, '0-21', 'None=0-4, Mild=5-9, Moderate=10-14, Severe=15-21'),
('PSS-10', 'Perceived Stress Scale', 10, '0-40', 'Low=0-13, Moderate=14-26, High=27-40'),
('AUDIT', 'Alcohol Use Disorders', 10, '0-40', 'Abstinent=0, Low Risk=1-7, Hazardous=8-15, Harmful=16-19, Dependence=20+'),
('ASRS', 'ADHD Self-Report', 6, '0-24', 'Unlikely=0-10, Possible=11-19, Likely=20-24'),
('CAGE', 'Alcohol Abuse Screening', 4, '0-4', 'No Problem=0-1, Possible Problem=2+'),
('DASS-21', 'Depression Anxiety Stress', 21, '0-126', 'Normal, Mild, Moderate, Severe, Extremely Severe'),
('MINI', 'Mini International Neuropsychiatric', 27, 'Binary', 'Screen for major psychiatric disorders'),
('K6', 'Psychological Distress', 6, '0-30', 'Well=0-5, Mild=6-10, Moderate=11-17, Severe=18-30'),
('EPDS', 'Postpartum Depression', 10, '0-30', 'No Depression=0-9, Mild=10-12, Moderate=13-16, Severe=17+');

-- Sample screening questions
INSERT INTO screening_questions (tool_id, question_number, question_text, response_type, scoring_values)
VALUES
(1, 1, 'Little interest or pleasure in doing things?', 'scale_0_3', '0,1,2,3'),
(1, 2, 'Feeling down, depressed, or hopeless?', 'scale_0_3', '0,1,2,3'),
(2, 1, 'Feeling nervous, anxious or on edge?', 'scale_0_3', '0,1,2,3'),
(2, 2, 'Not being able to stop or control worrying?', 'scale_0_3', '0,1,2,3');