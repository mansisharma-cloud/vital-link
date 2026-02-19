from app.services.prediction import predict_risk


def test_predict_risk_healthy():
    metrics = {
        "heart_rate": 70,
        "glucose": 90,
        "stress_level": 20
    }
    result = predict_risk(metrics)
    assert result["overall_status"] == "Healthy"
    assert len(result["predictions"]) == 0


def test_predict_risk_diabetes_high():
    metrics = {
        "heart_rate": 70,
        "glucose": 130,
        "stress_level": 20
    }
    result = predict_risk(metrics)
    assert result["overall_status"] == "Warning"
    assert any(p["condition"] == "Diabetes" and p["risk_level"]
               == "High" for p in result["predictions"])


def test_predict_risk_arrhythmia():
    metrics = {
        "heart_rate": 110,
        "glucose": 90,
        "stress_level": 20
    }
    result = predict_risk(metrics)
    assert result["overall_status"] == "Stable"
    assert any(p["condition"] == "Arrhythmia" and p["risk_level"]
               == "Moderate" for p in result["predictions"])


def test_predict_risk_hypertension():
    metrics = {
        "heart_rate": 70,
        "glucose": 90,
        "stress_level": 80
    }
    result = predict_risk(metrics)
    assert result["overall_status"] == "Stable"
    assert any(p["condition"] == "Hypertension" and p["risk_level"]
               == "Moderate" for p in result["predictions"])


def test_predict_risk_multiple():
    metrics = {
        "heart_rate": 45,
        "glucose": 110,
        "stress_level": 20
    }
    result = predict_risk(metrics)
    assert result["overall_status"] == "Stable"
    assert len(result["predictions"]) == 2
    conditions = [p["condition"] for p in result["predictions"]]
    assert "Bradycardia" in conditions
    assert "Diabetes" in conditions
