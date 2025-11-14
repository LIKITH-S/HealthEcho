#!/usr/bin/env python3
"""Simple test script to verify API and Rasa setup"""

import requests
import json
import time
import subprocess
import os
import sys

def check_port(port, timeout=2):
    """Check if port is listening"""
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex(('127.0.0.1', port))
        sock.close()
        return result == 0
    except:
        return False

def test_rasa_server():
    """Test if Rasa server responds on port 5005"""
    print("\n[1] Testing Rasa server on port 5005...")
    
    if not check_port(5005):
        print("  WAITING: Rasa not responding, attempting to start...")
        return False
    
    try:
        resp = requests.get('http://127.0.0.1:5005/', timeout=5)
        print(f"  OK: Rasa server responding ({resp.status_code})")
        return True
    except Exception as e:
        print(f"  FAIL: {e}")
        return False

def test_flask_health():
    """Test Flask health endpoint"""
    print("\n[2] Testing Flask health endpoint...")
    
    if not check_port(5002):
        print("  INFO: Flask port 5002 not listening yet")
        return False
    
    try:
        resp = requests.get('http://127.0.0.1:5002/health', timeout=5)
        print(f"  Response: {resp.json()}")
        return resp.status_code == 200
    except Exception as e:
        print(f"  FAIL: {e}")
        return False

def test_chatbot_message():
    """Test sending a message to chatbot"""
    print("\n[3] Testing chatbot message endpoint...")
    
    try:
        payload = {'sender': 'test_user', 'message': 'Hello'}
        resp = requests.post(
            'http://127.0.0.1:5002/webhooks/rest/webhook',
            json=payload,
            timeout=10
        )
        print(f"  Response: {resp.status_code}")
        if resp.status_code == 200:
            print(f"  Messages: {resp.json()}")
        else:
            print(f"  Error: {resp.text}")
        return resp.status_code == 200
    except Exception as e:
        print(f"  FAIL: {e}")
        return False

def check_models():
    """Check if trained models exist"""
    print("\n[4] Checking trained models...")
    models_dir = 'models'
    if os.path.exists(models_dir):
        models = [f for f in os.listdir(models_dir) if f.endswith('.tar.gz')]
        print(f"  Found {len(models)} trained models:")
        for m in sorted(models, reverse=True)[:2]:
            size = os.path.getsize(f'{models_dir}/{m}') / (1024*1024)
            print(f"    - {m} ({size:.1f} MB)")
        return len(models) > 0
    print("  No models directory found")
    return False

if __name__ == '__main__':
    print("=" * 60)
    print("HealthEcho Chatbot Service Test")
    print("=" * 60)
    
    check_models()
    
    results = {
        'Rasa Server': test_rasa_server(),
        'Flask Health': test_flask_health(),
        'Chatbot Message': test_chatbot_message(),
    }
    
    print("\n" + "=" * 60)
    print("Summary:")
    for test, result in results.items():
        status = "PASS" if result else "FAIL"
        print(f"  {test}: {status}")
    print("=" * 60)
