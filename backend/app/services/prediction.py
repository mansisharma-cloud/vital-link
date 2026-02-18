import numpy as np
from typing import Dict


def predict_risk(metrics: Dict[str, float]) -> Dict[str, any]:
    """
    Simple rule-based heuristic for health risk prediction.
    In a real app, this would use a loaded scikit-learn/TensorFlow model.
    """
    heart_rate = metrics.get("heart_rate", 70)
    glucose = metrics.get("glucose", 90)
    stress_level = metrics.get("stress_level", 20)

    risks = []

    # Simple logic for diabetes risk
    if glucose > 125:
        risks.append({"condition": "Diabetes",
                     "risk_level": "High", "score": 85})
    elif glucose > 100:
        risks.append({"condition": "Diabetes",
                     "risk_level": "Moderate", "score": 45})

    # Simple logic for arrhythmia/hypertension risk
    if heart_rate > 100:
        risks.append({"condition": "Arrhythmia",
                     "risk_level": "Moderate", "score": 50})
    elif heart_rate < 50:
        risks.append({"condition": "Bradycardia",
                     "risk_level": "Moderate", "score": 40})

    if stress_level > 70:
        risks.append({"condition": "Hypertension",
                     "risk_level": "Moderate", "score": 55})

    if not risks:
        return {"overall_status": "Healthy", "predictions": []}

    return {
        "overall_status": "Warning" if any(r["risk_level"] == "High" for r in risks) else "Stable",
        "predictions": risks
    }
