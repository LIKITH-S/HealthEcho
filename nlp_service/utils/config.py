import os
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

NLP_PORT = os.getenv('NLP_PORT', 5001)
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')
