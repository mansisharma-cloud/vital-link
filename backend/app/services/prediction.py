from typing import Dict, Any


def predict_risk(metrics: Dict[str, float]) -> Dict[str, Any]:
    """
    Enhanced rule-based heuristic for health risk prediction.
    Simulates a more complex AI model by considering multiple metric interactions.
    """
    heart_rate = metrics.get("heart_rate", 70)
    glucose = metrics.get("glucose", 90)
    stress_level = metrics.get("stress_level", 20)
    spo2 = metrics.get("spo2", 98)
    bp_sys = metrics.get("blood_pressure_sys", 120)
    bp_dia = metrics.get("blood_pressure_dia", 80)

    risks = []

    # Cardiovascular Risk
    if heart_rate > 100:
        risks.append({
            "condition": "Arrhythmia",
            "risk_level": "High" if heart_rate > 130 else "Moderate",
            "score": 50 + (heart_rate - 100)
        })
    elif heart_rate < 50:
        risks.append({
            "condition": "Bradycardia",
            "risk_level": "Moderate",
            "score": round(100 - heart_rate, 1)
        })

    # Blood Pressure / Stress Risk
    if bp_sys > 140 or bp_dia > 90:
        risks.append({
            "condition": "Hypertension",
            "risk_level": "High" if bp_sys > 160 else "Moderate",
            "score": round(min(bp_sys / 2, 95), 1)
        })
    elif stress_level > 70:
        risks.append({
            "condition": "Hypertension",
            "risk_level": "Moderate",
            "score": float(stress_level)
        })

    # Metabolic Risk (Diabetes/Glucose)
    if glucose > 125:
        risks.append({
            "condition": "Diabetes",
            "risk_level": "High",
            "score": round(glucose / 1.5, 1)
        })
    elif glucose > 100:
        risks.append({
            "condition": "Diabetes",
            "risk_level": "Moderate",
            "score": 40.0
        })

    # Respiratory Risk (SpO2)
    if spo2 < 92:
        risks.append({
            "condition": "Hypoxemia",
            "risk_level": "High",
            "score": 92.0
        })
    elif spo2 < 95:
        risks.append({
            "condition": "Mild Oxygen Desaturation",
            "risk_level": "Moderate",
            "score": 45.0
        })

    if not risks:
        return {
            "overall_status": "Healthy",
            "predictions": [],
            "summary": "All telemetry indices are within clinical baseline ranges."
        }

    return {
        "overall_status": "Warning" if any(r["risk_level"] == "High" for r in risks) else "Stable",
        "predictions": risks,
        "summary": f"Detected {len(risks)} clinical anomalies requiring attention."
    }
