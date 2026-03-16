import React, { useState, useEffect } from "react";
import "./AIHealthRiskPrediction.css"

const AiRisk = () => {
  const [formData, setFormData] = useState({
    age: "",
    bp: "",
    sugar: "",
    cholesterol: "",
    bmi: "",
    smoking: "No",
  });

  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("riskHistory")) || [];
    setHistory(saved);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateRisk = () => {
    let score = 0;

    if (formData.age > 50) score += 20;
    if (formData.bp > 140) score += 20;
    if (formData.sugar > 130) score += 20;
    if (formData.cholesterol > 220) score += 20;
    if (formData.bmi > 28) score += 10;
    if (formData.smoking === "Yes") score += 10;

    return score;
  };

  const runPrediction = () => {
    setLoading(true);

    setTimeout(() => {
      const score = calculateRisk();
      setRiskScore(score);

      const newEntry = {
        date: new Date().toLocaleDateString(),
        risk: score,
      };

      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("riskHistory", JSON.stringify(updatedHistory));

      setLoading(false);
    }, 2000);
  };

  const riskLevel = () => {
    if (riskScore <= 30) return "Low";
    if (riskScore <= 60) return "Medium";
    return "High";
  };

  const doctorType = () => {
    if (riskScore > 60) return "Cardiologist";
    if (riskScore > 30) return "General Physician";
    return "Healthy – No doctor needed";
  };

  return (
    <div className="ai-container">
      <h1 className="title">
        AI Powered Preventive Health Risk Prediction System
      </h1>

      <div className="ai-grid">

        {/* FORM */}
        <div className="card">
          <h2>Patient Health Parameters</h2>

          <input
            name="age"
            placeholder="Age"
            onChange={handleChange}
          />

          <input
            name="bp"
            placeholder="Blood Pressure (mmHg)"
            onChange={handleChange}
          />

          <input
            name="sugar"
            placeholder="Blood Sugar (mg/dL)"
            onChange={handleChange}
          />

          <input
            name="cholesterol"
            placeholder="Cholesterol Level"
            onChange={handleChange}
          />

          <input
            name="bmi"
            placeholder="BMI"
            onChange={handleChange}
          />

          <select name="smoking" onChange={handleChange}>
            <option>No</option>
            <option>Yes</option>
          </select>

          <button className="run-btn" onClick={runPrediction}>
            Run AI Prediction
          </button>
        </div>

        {/* RESULT */}
        <div className="card result-card">
          <h2>AI Prediction Result</h2>

          {loading && (
            <div className="loading">
              <p>Analyzing patient data...</p>
              <p>Running machine learning model...</p>
              <p>Calculating health risk...</p>
            </div>
          )}

          {!loading && riskScore !== null && (
            <>
              <div className="meter">
                <div className="meter-circle">
                  {riskScore}%
                </div>
                <p className={`risk ${riskLevel().toLowerCase()}`}>
                  {riskLevel()} Risk
                </p>
              </div>

              <div className="analysis">
                <h3>AI Health Analysis</h3>

                <p>Blood Pressure : {formData.bp > 140 ? "High ⚠️" : "Normal ✅"}</p>
                <p>Blood Sugar : {formData.sugar > 130 ? "High ⚠️" : "Normal ✅"}</p>
                <p>Cholesterol : {formData.cholesterol > 220 ? "High ⚠️" : "Normal ✅"}</p>
                <p>BMI : {formData.bmi > 28 ? "Overweight ⚠️" : "Normal ✅"}</p>
              </div>

              <div className="doctor">
                <h3>AI Recommendation</h3>
                <p>Consult: <strong>{doctorType()}</strong></p>
              </div>

              <div className="explain">
                <h3>AI Explanation</h3>
                <p>
                  Based on the provided health parameters, the AI model
                  estimates the probability of cardiovascular and metabolic
                  risk factors.
                </p>
              </div>
            </>
          )}
        </div>

      </div>

      {/* HISTORY */}
      <div className="history">
        <h2>Previous Predictions</h2>

        {history.map((h, i) => (
          <div key={i} className="history-row">
            <span>{h.date}</span>
            <span>{h.risk}% Risk</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiRisk;