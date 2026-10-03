import requests

# 1. FIXED: Point to the actual endpoint defined in main.py
API_URL = "http://localhost:8000/verify"

# 2. FIXED: Match the keys expected by your ClaimRequest schema
adversarial_payloads = [
    {"claim_id": "STRESS-01", "generated_claim": "$4,500,000.00"},       
    {"claim_id": "STRESS-02", "generated_claim": "4.5M"},                
    {"claim_id": "STRESS-03", "generated_claim": "approx five million"}, 
    {"claim_id": "STRESS-04", "generated_claim": "N/A"},                    
    {"claim_id": "STRESS-05", "generated_claim": "null"},                     
    {"claim_id": "STRESS-06", "generated_claim": "DROP TABLE logs;"}        
]

print("COMMENCING ADVERSARIAL STRESS TEST...\n")

for i, payload in enumerate(adversarial_payloads):
    try:
        response = requests.post(API_URL, json=payload)
        status = response.status_code
        
        # Extract the specific verdict or error message
        if status == 200:
            result = response.json().get("verdict", "UNKNOWN")
        else:
            result = response.json().get("detail", "HTTP ERROR")
            
        print(f"Test {i+1} | Claim: {payload['generated_claim']:<20} | Status: {status} | Result: {result}")
        
    except Exception as e:
        print(f"Test {i+1} | Claim: {payload['generated_claim']:<20} | FATAL CRASH: {e}")