from transformers import MarianMTModel, MarianTokenizer
import logging

logger = logging.getLogger(__name__)

# Language pairs for multi-lingual translation
LANGUAGE_PAIRS = {
    'en_hi': 'Helsinki-NLP/Opus-MT-en-hi',
    'en_ta': 'Helsinki-NLP/Opus-MT-en-ta',
    'en_te': 'Helsinki-NLP/Opus-MT-en-te',
    'en_ml': 'Helsinki-NLP/Opus-MT-en-ml',
    'hi_en': 'Helsinki-NLP/Opus-MT-hi-en'
}

def translate_text(text, source_lang='en', target_lang='en'):
    """Translate text to target language"""
    try:
        if source_lang == target_lang:
            return text

        model_name = LANGUAGE_PAIRS.get(f'{source_lang}_{target_lang}')
        if not model_name:
            logger.warning(f"Language pair not supported: {source_lang}-{target_lang}")
            return text

        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)

        inputs = tokenizer(text, return_tensors="pt", padding=True)
        translated = model.generate(**inputs)
        result = tokenizer.decode(translated[0], skip_special_tokens=True)

        logger.info(f"Translated from {source_lang} to {target_lang}")
        return result

    except Exception as e:
        logger.error(f"Translation failed: {str(e)}")
        return text
