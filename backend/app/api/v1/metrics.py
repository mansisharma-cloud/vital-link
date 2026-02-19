from fastapi import APIRouter, WebSocket
import asyncio
import random
import time

router = APIRouter()


@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Simulate real-time sensor data with slight variations
            heart_rate = random.randint(65, 85) + random.uniform(-2, 2)
            glucose = 90 + 10 * random.uniform(-1, 1)  # mg/dL
            temp = 36.5 + 0.5 * random.uniform(-1, 1)
            stress = random.randint(15, 35)

            data = {
                "heart_rate": round(heart_rate, 1),
                "glucose": round(glucose, 1),
                "temperature": round(temp, 1),
                "stress_level": stress,
                "timestamp": int(time.time() * 1000),
                "status": "Normal" if heart_rate < 90 else "Review"
            }
            await websocket.send_json(data)
            await asyncio.sleep(1.5)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()
