import re
import string

def clean_text(text):
    """Clean and normalize medical text"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Remove special characters except medical notations
    text = re.sub(r'[^\w\s\-/.°±()%]', '', text)
    
    # Normalize abbreviations
    abbreviations = {
        'pt': 'patient',
        'dr': 'doctor',
        'mg': 'milligram',
        'ml': 'milliliter',
        'bd': 'twice daily',
        'od': 'once daily',
        'tid': 'three times daily'
    }
    
    for abbr, full in abbreviations.items():
        text = re.sub(r'\b' + abbr + r'\b', full, text, flags=re.IGNORECASE)
    
    return text

def tokenize_medical_text(text):
    """Tokenize medical text preserving important terms"""
    tokens = text.split()
    return tokens
