#!/usr/bin/env python3
"""
HealthEcho Chatbot API Validation Script
Tests all major endpoints and validates responses
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Tuple

class ChatbotAPIValidator:
    def __init__(self, api_url: str = "http://127.0.0.1:5002", rasa_url: str = "http://127.0.0.1:5005"):
        self.api_url = api_url
        self.rasa_url = rasa_url
        self.results = []
        self.test_count = 0
        self.passed_count = 0
        
    def test(self, name: str, test_func) -> bool:
        """Run a single test"""
        self.test_count += 1
        try:
            test_func()
            self.passed_count += 1
            self.results.append((name, "PASS", None))
            print(f"✓ {name}")
            return True
        except AssertionError as e:
            self.results.append((name, "FAIL", str(e)))
            print(f"✗ {name}: {e}")
            return False
        except Exception as e:
            self.results.append((name, "ERROR", str(e)))
            print(f"✗ {name}: {type(e).__name__}: {e}")
            return False

    def validate_response_format(self, response: Dict, expected_fields: list):
        """Validate JSON response has expected fields"""
        for field in expected_fields:
            assert field in response, f"Missing field: {field}"
    
    def run_tests(self):
        """Execute all tests"""
        print("=" * 70)
        print("HealthEcho Chatbot API Validation")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        print()
        
        # Test 1: Health Check
        def test_health():
            resp = requests.get(f"{self.api_url}/health", timeout=5)
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            data = resp.json()
            assert "status" in data, "Missing 'status' in response"
            assert "Chatbot Service running" in data["status"]
        
        self.test("Health Check Endpoint", test_health)
        
        # Test 2: Basic Message Processing
        def test_message_greeting():
            payload = {"sender": "test_user", "message": "Hello"}
            resp = requests.post(f"{self.api_url}/webhooks/rest/webhook", json=payload, timeout=5)
            assert resp.status_code == 200
            data = resp.json()
            assert isinstance(data, list) and len(data) > 0
            self.validate_response_format(data[0], ["recipient_id", "text", "timestamp"])
            assert data[0]["intent"] in ["greet", "default"]
        
        self.test("Message Processing - Greeting", test_message_greeting)
        
        # Test 3: Intent Detection - Medication
        def test_medication_intent():
            payload = {"sender": "test_user", "message": "What medication should I take?"}
            resp = requests.post(f"{self.api_url}/webhooks/rest/webhook", json=payload, timeout=5)
            assert resp.status_code == 200
            data = resp.json()
            assert data[0]["intent"] == "medication_question"
            assert "medication" in data[0]["text"].lower()
        
        self.test("Intent Detection - Medication", test_medication_intent)
        
        # Test 4: Intent Detection - Mental Health
        def test_mental_health_intent():
            payload = {"sender": "test_user", "message": "I'm feeling anxious"}
            resp = requests.post(f"{self.api_url}/webhooks/rest/webhook", json=payload, timeout=5)
            assert resp.status_code == 200
            data = resp.json()
            assert data[0]["intent"] in ["mental_health", "symptom_inquiry"]
        
        self.test("Intent Detection - Mental Health", test_mental_health_intent)
        
        # Test 5: Intent Detection - Emergency
        def test_emergency_intent():
            payload = {"sender": "test_user", "message": "Emergency! I need help!"}
            resp = requests.post(f"{self.api_url}/webhooks/rest/webhook", json=payload, timeout=5)
            assert resp.status_code == 200
            data = resp.json()
            assert data[0]["intent"] == "emergency"
            assert "emergency" in data[0]["text"].lower()
        
        self.test("Intent Detection - Emergency", test_emergency_intent)
        
        # Test 6: Conversation Tracker
        def test_tracker():
            resp = requests.get(f"{self.api_url}/api/conversations/test_user", timeout=5)
            assert resp.status_code == 200
            data = resp.json()
            assert "sender" in data
            assert "messages" in data or "slots" in data
        
        self.test("Conversation Tracker Endpoint", test_tracker)
        
        # Test 7: Rasa Server Health (if available)
        def test_rasa_health():
            resp = requests.get(f"{self.rasa_url}/", timeout=5)
            assert resp.status_code == 200
        
        self.test("Rasa Server Health Check", test_rasa_health)
        
        # Test 8: Multiple Users (Conversation Isolation)
        def test_multiple_users():
            for user_id in ["user1", "user2", "user3"]:
                payload = {"sender": user_id, "message": "Hello"}
                resp = requests.post(f"{self.api_url}/webhooks/rest/webhook", json=payload, timeout=5)
                assert resp.status_code == 200
                assert resp.json()[0]["recipient_id"] == user_id
        
        self.test("Multiple User Isolation", test_multiple_users)
        
        # Test 9: Invalid Input Handling
        def test_invalid_input():
            payload = {"sender": "test_user"}  # Missing message
            resp = requests.post(f"{self.api_url}/webhooks/rest/webhook", json=payload, timeout=5)
            # Should either return error or default response
            assert resp.status_code in [200, 400, 500]
        
        self.test("Invalid Input Handling", test_invalid_input)
        
        # Test 10: Response Content Validation
        def test_response_content():
            payload = {"sender": "test_user", "message": "Goodbye"}
            resp = requests.post(f"{self.api_url}/webhooks/rest/webhook", json=payload, timeout=5)
            data = resp.json()
            assert len(data[0]["text"]) > 0, "Empty response text"
            assert len(data[0]["text"]) < 500, "Response text too long"
            assert data[0]["intent"] == "goodbye"
        
        self.test("Response Content Validation", test_response_content)
        
        # Print summary
        print()
        print("=" * 70)
        print(f"Test Results: {self.passed_count}/{self.test_count} PASSED")
        print("=" * 70)
        
        if self.passed_count == self.test_count:
            print("Status: ALL TESTS PASSED ✓")
            return True
        else:
            print("Status: SOME TESTS FAILED ✗")
            for name, status, error in self.results:
                if status != "PASS":
                    print(f"  - {name}: {error}")
            return False

if __name__ == "__main__":
    validator = ChatbotAPIValidator()
    success = validator.run_tests()
    exit(0 if success else 1)
