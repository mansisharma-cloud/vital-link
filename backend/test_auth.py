import requests
import json

base_url = "http://localhost:8000/api/v1"


def test_doctor_signup():
    payload = {
        "full_name": "Dr. Tester",
        "email": f"test{int(__import__('time').time())}@example.com",
        "qualification": "MD",
        "role": "General Physician",
        "emergency_contact": "1234567890",
        "consultation_timings": "9-5",
        "password": "Password123!",
        "new_hospital_name": "Test Hospital",
        "new_hospital_address": "Test Address",
        "new_hospital_contact": "9998887776",
        "new_hospital_code": "TEST"
    }

    response = requests.post(f"{base_url}/auth/doctor/signup", json=payload)
    print(f"Signup Status: {response.status_code}")
    print(f"Signup Response: {response.text}")
    return payload if response.status_code == 200 else None


def test_doctor_login(email, password):
    payload = {
        "email": email,
        "password": password
    }
    response = requests.post(f"{base_url}/auth/doctor/login", json=payload)
    print(f"Login Status: {response.status_code}")
    print(f"Login Response: {response.text}")
    return response.json().get("access_token") if response.status_code == 200 else None


if __name__ == "__main__":
    data = test_doctor_signup()
    if data:
        token = test_doctor_login(data["email"], data["password"])
        if token:
            print("Cleanup/Verification successful.")
