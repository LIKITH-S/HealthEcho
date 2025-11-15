import spacy
from transformers import pipeline
import re
from utils.logger import logger

# Load models
nlp = spacy.load("en_core_med7_trf")  # Medical NER model
medical_ner = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")

MEDICAL_KEYWORDS = {
    'medications': ['medication', 'drug', 'medicine', 'pill', 'tablet', 'injection', 'dose', 'dosage'],
    'diagnoses': ['diagnosis', 'disease', 'disorder', 'condition', 'syndrome', 'infection'],
    'tests': ['test', 'examination', 'scan', 'xray', 'ultrasound', 'mri', 'ct', 'blood test'],
    'symptoms': ['symptom', 'pain', 'ache', 'fever', 'swelling', 'rash', 'cough', 'nausea']
}

def extract_entities(text, report_id=None):
    """Extract medical entities from text"""
    try:
        result = {
            'diagnoses': [],
            'medications': [],
            'dosages': [],
            'frequencies': [],
            'test_results': [],
            'vital_signs': {},
            'clinical_notes': text[:500],
            'confidence_score': 0.0
        }

        # Use spaCy for NER
        doc = nlp(text)
        
        entities_by_type = {}
        for ent in doc.ents:
            if ent.label_ not in entities_by_type:
                entities_by_type[ent.label_] = []
            entities_by_type[ent.label_].append(ent.text)

        # Map spaCy entities to result
        result['diagnoses'] = entities_by_type.get('PROBLEM', [])
        result['medications'] = entities_by_type.get('TREATMENT', [])
        result['test_results'] = entities_by_type.get('TEST', [])

        # Extract dosages and frequencies
        result['dosages'] = extract_dosages(text)
        result['frequencies'] = extract_frequencies(text)

        # Extract vital signs
        result['vital_signs'] = extract_vital_signs(text)

        # Calculate confidence (average entity score)
        if len(doc.ents) > 0:
            result['confidence_score'] = sum([ent._.confidence for ent in doc.ents]) / len(doc.ents)
        else:
            result['confidence_score'] = 0.5

        logger.info(f"Entities extracted for report {report_id}: {len(entities_by_type)} types")
        return result

    except Exception as e:
        logger.error(f"Entity extraction error: {str(e)}")
        return None

def extract_dosages(text):
    """Extract medication dosages"""
    dosage_pattern = r'(\d+(?:\.\d+)?)\s*(mg|g|ml|units?|tablets?|capsules?|drops?)'
    dosages = re.findall(dosage_pattern, text, re.IGNORECASE)
    return [f"{amount} {unit}" for amount, unit in dosages]

def extract_frequencies(text):
    """Extract medication frequencies"""
    frequency_keywords = ['daily', 'twice daily', 'three times', 'weekly', 'monthly', 'every day', 'once a day', 'bd', 'tid', 'od']
    frequencies = [freq for freq in frequency_keywords if freq.lower() in text.lower()]
    return frequencies

def extract_vital_signs(text):
    """Extract vital signs"""
    vital_patterns = {
        'blood_pressure': r'(?:BP|blood pressure)[:\s]*(\d+/\d+)',
        'heart_rate': r'(?:HR|heart rate|pulse)[:\s]*(\d+)',
        'temperature': r'(?:temp|temperature)[:\s]*(\d+\.?\d*)',
        'blood_sugar': r'(?:glucose|blood sugar)[:\s]*(\d+(?:\.\d+)?)',
        'oxygen_saturation': r'(?:O2|SpO2|oxygen)[:\s]*(\d+)'
    }
    
    vitals = {}
    for vital_name, pattern in vital_patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            vitals[vital_name] = match.group(1)
    
    return vitals
