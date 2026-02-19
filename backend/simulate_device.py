import asyncio
import random
import httpx
import sys
from datetime import datetime

# Configure base URL
BASE_URL = "http://localhost:8000/api/v1"


async def simulate_data(patient_id: int, token: str):
    print(f"Starting simulation for Patient ID {patient_id}...")

    async with httpx.AsyncClient() as client:
        headers = {"Authorization": f"Bearer {token}"}

        while True:
            # Generate random metrics
            metrics = [
                {"type": "heart_rate", "value": round(
                    random.uniform(60, 100), 1)},
                {"type": "glucose", "value": round(
                    random.uniform(80, 140), 1)},
                {"type": "temperature", "value": round(
                    random.uniform(97.5, 99.5), 1)},
                {"type": "blood_pressure_sys", "value": round(
                    random.uniform(110, 130), 1)},
                {"type": "blood_pressure_dia", "value": round(
                    random.uniform(70, 90), 1)},
                {"type": "stress_level", "value": round(
                    random.uniform(10, 50), 1)},
                {"type": "spo2", "value": round(
                    random.uniform(95, 100), 1)},
            ]

            # Select 1-2 random metrics to send per interval
            to_send = random.sample(metrics, k=random.randint(1, 2))

            for m in to_send:
                try:
                    payload = {
                        "metric_type": m["type"],
                        "value": m["value"]
                    }
                    response = await client.post(
                        f"{BASE_URL}/patients/metrics",
                        json=payload,
                        headers=headers
                    )
                    if response.status_code == 200:
                        print(
                            f"[{datetime.now().strftime('%H:%M:%S')}] Sent {m['type']}: {m['value']}")
                    else:
                        print(f"Failed to send {m['type']}: {response.text}")
                except httpx.HTTPError as e:
                    print(f"HTTP error sending data: {e}")
                except Exception as e:
                    print(f"Unexpected error sending data: {e}")

            await asyncio.sleep(5)  # Send data every 5 seconds

if __name__ == "__main__":
    # Typically run as: python simulate_device.py <patient_id> <token>
    if len(sys.argv) < 3:
        print("Usage: python simulate_device.py <patient_id> <token>")
        sys.exit(1)

    p_id = int(sys.argv[1])
    jwt_token = sys.argv[2]

    try:
        asyncio.run(simulate_data(p_id, jwt_token))
    except KeyboardInterrupt:
        print("Simulation stopped.")
