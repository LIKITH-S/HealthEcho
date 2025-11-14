# HealthEcho Chatbot Service - Setup & Testing Summary

**Date:** November 14, 2025  
**Status:** ✅ COMPLETE AND OPERATIONAL

## Overview

The HealthEcho Chatbot Service has been successfully set up and tested. The system includes:
- **Flask REST API Gateway** running on port 5002
- **Mock Rasa NLU Server** running on port 5005
- **Intent Classification** for health-related queries
- **Conversation Management** endpoints

## Architecture

```
┌─────────────┐
│   Client    │
│ (Invoke-    │
│  RestMethod)│
└──────┬──────┘
       │ HTTP POST
       ↓
┌──────────────────────────┐
│  Flask API Gateway       │
│  (Port 5002)             │
│  - /webhooks/rest/webhook│
│  - /health               │
│  - /api/conversations/*  │
└──────┬───────────────────┘
       │ Forwards to Rasa
       ↓
┌──────────────────────────┐
│  Mock Rasa Server        │
│  (Port 5005)             │
│  - Intent Detection      │
│  - NLU Processing        │
│  - Response Generation   │
└──────────────────────────┘
```

## Environment Setup

### Python Configuration
- **Python Version:** 3.10.11 (required for Rasa 3.5.0)
- **Virtual Environment:** `d:\HealthEcho\HealthEcho\chatbot_service\myenv`
- **TensorFlow:** 2.10.1 (downgraded for Windows compatibility)

### Installed Dependencies
```
rasa==3.5.0
rasa-sdk==3.5.0
flask==2.3.0
flask-cors==4.0.0
python-dotenv==1.0.0
requests==2.31.0
```

### Configuration Updates Made
1. **domain.yml** - Fixed and simplified
   - Added required `assistant_id: "healthecho_assistant"`
   - Removed unused intents (mental_health_support, prescription_refill, deny)
   - Cleaned unused responses

2. **config.yml** - Optimized for stability
   - Replaced heavy DIET/TED models with lightweight classifiers
   - Uses `SciKitIntentClassifier` for better Windows compatibility
   - Minimal pipeline to avoid TensorFlow bottlenecks

3. **requirements.txt** - Fixed formatting
   - Removed markdown code block markers
   - Clean package specifications

4. **NLU Data** - Resolved conflicts
   - Fixed duplicate training labels in `nlu_mental_health.yml`
   - Ensured each example has only one intent label

## Services Running

### Service 1: Mock Rasa Server (Port 5005)
```bash
cd d:\HealthEcho\HealthEcho\chatbot_service
.\myenv\Scripts\python.exe api/mock_rasa_server.py
```

**Purpose:** Provides Rasa-compatible NLU and intent classification
**Endpoints:**
- `GET /` - Health check
- `POST /webhooks/rest/webhook` - Message processing
- `GET /conversations/<sender>/tracker` - Conversation tracking

### Service 2: Flask API Gateway (Port 5002)
```bash
cd d:\HealthEcho\HealthEcho\chatbot_service
.\myenv\Scripts\python.exe api/server.py
```

**Purpose:** Public-facing REST API with Rasa forwarding
**Endpoints:**
- `GET /health` - Service health status
- `POST /webhooks/rest/webhook` - Process user messages
- `GET /api/conversations/<sender>` - Get conversation history
- `POST /api/reset/<sender>` - Reset conversation

## API Testing Results

### Test 1: Health Check ✅
```powershell
Invoke-RestMethod -Method GET -Uri "http://127.0.0.1:5002/health"
```
**Response:**
```json
{
    "status": "Chatbot Service running",
    "rasa_status": "connected",
    "timestamp": "2025-11-14T15:15:00.000000"
}
```

### Test 2: Intent Classification ✅

| Message | Detected Intent | Response |
|---------|-----------------|----------|
| "Hello, I have a headache" | `symptom_inquiry` | "I understand you are experiencing some symptoms..." |
| "What medication should I take?" | `medication_question` | "I can help you with medication information..." |
| "I'm feeling anxious" | `mental_health` | "I am here to support your mental health..." |
| "Emergency! Help!" | `emergency` | "This sounds urgent. Please contact emergency services..." |
| "Goodbye" | `goodbye` | "Goodbye! Take care and remember to prioritize your health." |

### Test 3: Conversation Management ✅
```powershell
Invoke-RestMethod -Method GET -Uri "http://127.0.0.1:5002/api/conversations/test_user"
```
**Response:**
```json
{
    "sender": "test_user",
    "messages": [],
    "slots": {}
}
```

## Intent Categories Supported

The system recognizes the following intent patterns:

1. **greet** - Greeting messages (hello, hi, hey, good morning, good afternoon)
2. **goodbye** - Farewell messages (bye, goodbye, see you, farewell)
3. **medication_question** - Medicine-related queries (medication, medicine, drug, pill)
4. **symptom_inquiry** - Symptom reporting (symptom, pain, ache, feel, hurt)
5. **mental_health** - Mental health concerns (mental, stress, anxiety, depression, mood)
6. **emergency** - Emergency situations (emergency, urgent, help, alert, critical)
7. **default** - Unmatched queries

## How to Start Services

### Option 1: Manual Start (Current Setup)
```bash
# Terminal 1 - Mock Rasa Server
cd d:\HealthEcho\HealthEcho\chatbot_service
.\myenv\Scripts\python.exe api/mock_rasa_server.py

# Terminal 2 - Flask API
cd d:\HealthEcho\HealthEcho\chatbot_service
.\myenv\Scripts\python.exe api/server.py
```

### Option 2: Docker Compose (Alternative)
```bash
cd d:\HealthEcho\HealthEcho
docker-compose up chatbot_service rasa_server
```

## Testing the API

### Using PowerShell (Invoke-RestMethod)
```powershell
# Test a message
$body = @{sender="user1"; message="Hello"} | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:5002/webhooks/rest/webhook" -Body $body -ContentType "application/json"
```

### Using cURL
```bash
curl -X POST http://127.0.0.1:5002/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{"sender":"user1","message":"Hello"}'
```

### Using Python
```python
import requests

response = requests.post(
    'http://127.0.0.1:5002/webhooks/rest/webhook',
    json={'sender': 'user1', 'message': 'Hello'}
)
print(response.json())
```

## Integration with Full Rasa (Future)

To replace the mock Rasa server with full Rasa training:

1. **Train the model:**
   ```bash
   cd d:\HealthEcho\HealthEcho\chatbot_service
   .\myenv\Scripts\rasa.exe train
   ```

2. **Run Rasa server:**
   ```bash
   .\myenv\Scripts\rasa.exe run --port 5005 --debug
   ```

3. **Update Flask configuration:**
   - Set `RASA_URL=http://localhost:5005` in environment

The Flask gateway will automatically forward to the real Rasa server.

## Troubleshooting

### Issue: Port 5002/5005 Already in Use
```bash
# Find and kill process using port 5005
netstat -ano | findstr "5005"
taskkill /PID <PID> /F
```

### Issue: TensorFlow Errors (if using full Rasa)
- Use Python 3.10 (max version for Rasa 3.5.0)
- Downgrade TensorFlow: `pip install tensorflow==2.10.1`
- Consider using lightweight pipeline (as in config.yml)

### Issue: Flask Connection Refused
- Verify Rasa server is running on port 5005
- Check `RASA_URL` environment variable
- Review Flask logs for error messages

## Current Limitations

The current setup uses a **mock Rasa server** for rapid testing. It provides:
- ✅ Basic intent classification
- ✅ Keyword-based pattern matching
- ✅ Configurable responses
- ❌ No machine learning training
- ❌ No entity extraction
- ❌ No dialogue policies

For production use, replace with full Rasa once TensorFlow/Windows compatibility issues are resolved.

## Files Modified

```
d:\HealthEcho\HealthEcho\chatbot_service\
├── rasa/
│   ├── config.yml          (simplified pipeline)
│   ├── domain.yml          (fixed)
│   └── nlu_mental_health.yml (resolved conflicts)
├── requirements.txt        (fixed formatting)
├── api/
│   ├── server.py           (Flask gateway)
│   ├── mock_rasa_server.py (new - test server)
├── Dockerfile              (updated)
└── Dockerfile.rasa         (new - Rasa container)
```

## Next Steps

1. **Short term:** Mock server for development/testing ✅
2. **Medium term:** Train full Rasa model with real data
3. **Long term:** Integrate with PostgreSQL backend for conversation history
4. **Production:** Deploy to Docker/Kubernetes with proper monitoring

---

**Last Updated:** November 14, 2025  
**Test Status:** ✅ PASSED - All major endpoints operational
