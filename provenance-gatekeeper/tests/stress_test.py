import requests

API_URL = "http://localhost:8000/evaluate"

# Edge-case payloads designed to break the Gatekeeper's math logic
adversarial_payloads = [
    {"claim": "$4,500,000.00", "truth": "4500000"},       # Commas and decimals
    {"claim": "4.5M", "truth": "4500000"},                # Financial abbreviations
    {"claim": "approx five million", "truth": "5000000"}, # Text-based numbers
    {"claim": "N/A", "truth": "1000"},                    # Non-numeric text
    {"claim": "null", "truth": "50"},                     # Null strings
    {"claim": "DROP TABLE logs;", "truth": "100"},        # SQL injection attempt
]

print("COMMENCING ADVERSARIAL STRESS TEST...\n")

for i, payload in enumerate(adversarial_payloads):
    try:
        response = requests.post(API_URL, json=payload)
        status = response.status_code
        result = response.json().get("verdict", "ERROR")
        
        print(f"Test {i+1} | Claim: {payload['claim']:<20} | Status: {status} | Verdict: {result}")
        
    except Exception as e:
        print(f"Test {i+1} | Claim: {payload['claim']:<20} | FATAL CRASH: {e}")