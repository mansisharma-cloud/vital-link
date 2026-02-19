import unittest
from app.services.prediction import predict_risk


class TestPrediction(unittest.TestCase):
    def test_predict_risk_healthy(self):
        metrics = {
            "heart_rate": 70,
            "glucose": 90,
            "stress_level": 20
        }
        result = predict_risk(metrics)
        self.assertEqual(result["overall_status"], "Healthy")
        self.assertEqual(len(result["predictions"]), 0)

    def test_predict_risk_diabetes_high(self):
        metrics = {
            "heart_rate": 70,
            "glucose": 130,
            "stress_level": 20
        }
        result = predict_risk(metrics)
        self.assertEqual(result["overall_status"], "Warning")
        self.assertTrue(any(p["condition"] == "Diabetes" and p["risk_level"]
                        == "High" for p in result["predictions"]))

    def test_predict_risk_arrhythmia(self):
        metrics = {
            "heart_rate": 110,
            "glucose": 90,
            "stress_level": 20
        }
        result = predict_risk(metrics)
        # Prediction service: "overall_status": "Warning" if any(r["risk_level"] == "High" for r in risks) else "Stable"
        # Arrhythmia with heart_rate 110 is Moderate risk (score 50), so status should be Stable
        self.assertEqual(result["overall_status"], "Stable")
        self.assertTrue(any(p["condition"] == "Arrhythmia" and p["risk_level"]
                        == "Moderate" for p in result["predictions"]))

    def test_predict_risk_hypertension(self):
        metrics = {
            "heart_rate": 70,
            "glucose": 90,
            "stress_level": 80
        }
        result = predict_risk(metrics)
        self.assertEqual(result["overall_status"], "Stable")
        self.assertTrue(any(p["condition"] == "Hypertension" and p["risk_level"]
                        == "Moderate" for p in result["predictions"]))


if __name__ == '__main__':
    unittest.main()
