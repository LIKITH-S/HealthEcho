# HealthEcho Chatbot - Quick Start Guide

## Status: ✅ OPERATIONAL

The HealthEcho Chatbot API is fully functional and ready for use.

## Starting the Services

### Quick Start (2 terminals)

**Terminal 1 - Mock Rasa Server (Port 5005):**
```bash
cd d:\HealthEcho\HealthEcho\chatbot_service
.\myenv\Scripts\python.exe api/mock_rasa_server.py
```

**Terminal 2 - Flask API Gateway (Port 5002):**
```bash
cd d:\HealthEcho\HealthEcho\chatbot_service
.\myenv\Scripts\python.exe api/server.py
```

Both services will start and be ready to accept requests.

## Using the Chatbot API

### Health Check
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5002/health"
```

### Send a Message
```powershell
$body = @{
    sender = "user1"
    message = "I have a headache"
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
  -Uri "http://127.0.0.1:5002/webhooks/rest/webhook" `
  -Body $body `
  -ContentType "application/json"
```

### Get Conversation History
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5002/api/conversations/user1"
```

## Supported Intents

The chatbot recognizes these types of queries:

| Intent | Keywords | Example |
|--------|----------|---------|
| **greet** | hello, hi, hey | "Hello there" |
| **goodbye** | bye, goodbye, farewell | "Goodbye" |
| **medication_question** | medication, drug, medicine | "What medication should I take?" |
| **symptom_inquiry** | symptom, pain, hurt, ache | "I have a headache" |
| **mental_health** | stress, anxiety, depression | "I'm feeling anxious" |
| **emergency** | emergency, urgent, help | "Emergency! Help!" |

## Configuration

### Environment Variables
- `RASA_URL` - URL of Rasa server (default: http://localhost:5005)
- `CHATBOT_PORT` - Flask server port (default: 5002)
- `FLASK_ENV` - development or production

### Update Intent Patterns
Edit `api/mock_rasa_server.py` and modify the `INTENT_PATTERNS` and `RESPONSES` dictionaries.

## Testing

Run validation tests:
```bash
.\myenv\Scripts\python.exe validate_api.py
```

## Integration with Your Application

### Python
```python
import requests

response = requests.post(
    'http://127.0.0.1:5002/webhooks/rest/webhook',
    json={'sender': 'user1', 'message': 'Hello'}
)
print(response.json())
```

### JavaScript/Node.js
```javascript
fetch('http://127.0.0.1:5002/webhooks/rest/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sender: 'user1', message: 'Hello' })
})
.then(r => r.json())
.then(data => console.log(data));
```

### cURL
```bash
curl -X POST http://127.0.0.1:5002/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{"sender":"user1","message":"Hello"}'
```

## Troubleshooting

**Problem: Connection Refused**
- Ensure both services are running
- Check ports 5002 and 5005 are not in use
- Verify firewall settings

**Problem: Slow Response**
- First request may be slower (Python startup)
- Subsequent requests should be <100ms
- Check system resources (RAM, CPU)

**Problem: Intent Not Detected**
- Check exact keywords in INTENT_PATTERNS
- Add more pattern variations for better coverage
- Use `"default"` intent for unknown queries

## Production Deployment

To deploy to production:

1. Use Docker Compose:
   ```bash
   cd d:\HealthEcho\HealthEcho
   docker-compose up -d chatbot_service rasa_server
   ```

2. Or use systemd/supervisord for process management

3. Add proper logging and monitoring

4. Use a reverse proxy (nginx) for load balancing

5. Enable HTTPS/TLS for secure communication

## Next Steps

1. Integrate with frontend application
2. Connect to PostgreSQL for conversation history
3. Train full Rasa models with domain data
4. Add authentication and rate limiting
5. Deploy to production infrastructure

---

**Support:** See CHATBOT_SETUP_COMPLETE.md for detailed documentation
