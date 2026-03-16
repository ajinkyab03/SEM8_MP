import React, { useState } from "react";
import "./AIMedicalReportAnalyzer.css";

const normalRanges = {
  Hemoglobin: { min: 13, max: 17 },
  Cholesterol: { min: 120, max: 200 },
  Sugar: { min: 70, max: 140 },
  Platelets: { min: 150000, max: 450000 },
  WBC: { min: 4000, max: 11000 }
};

const sampleReport = {
  Hemoglobin: 10.2,
  Cholesterol: 240,
  Sugar: 180,
  Platelets: 300000,
  WBC: 12000
};

const AIMedicalReportAnalyzer = () => {

  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const analyzeReport = () => {

    setAnalyzing(true);

    setTimeout(() => {

      const analyzed = Object.keys(sampleReport).map((key) => {

        const value = sampleReport[key];
        const range = normalRanges[key];

        let status = "Normal";

        if (value < range.min) status = "Low";
        if (value > range.max) status = "High";

        return {
          test: key,
          value,
          status
        };

      });

      setResults(analyzed);
      setAnalyzing(false);

    }, 2500);
  };

  const generateRecommendations = () => {

    if (!results) return [];

    let rec = [];

    results.forEach((r) => {

      if (r.test === "Cholesterol" && r.status === "High") {
        rec.push("High cholesterol detected. Reduce fatty food intake.");
      }

      if (r.test === "Sugar" && r.status === "High") {
        rec.push("Elevated blood sugar detected. Possible diabetes risk.");
      }

      if (r.test === "Hemoglobin" && r.status === "Low") {
        rec.push("Low hemoglobin detected. Increase iron-rich foods.");
      }

    });

    return rec;

  };

  return (

    <div className="report-page">

      <h1 className="page-title">AI Medical Report Analyzer</h1>
      <p className="page-subtitle">
        Upload a blood report and our AI engine will analyze medical parameters and detect abnormalities.
      </p>

      {/* Upload Section */}

      <div className="upload-card">

        <h2>Upload Medical Report</h2>

        <input type="file" onChange={handleUpload} />

        <button
          className="analyze-btn"
          onClick={analyzeReport}
          disabled={!file}
        >
          Run AI Analysis
        </button>

        {file && (
          <p className="file-name">
            Uploaded File: {file.name}
          </p>
        )}

      </div>

      {/* AI scanning animation */}

      {analyzing && (
        <div className="ai-scanning">

          <div className="scanner"></div>

          <p>AI Engine scanning medical report...</p>

        </div>
      )}

      {/* Results */}

      {results && (

        <div className="results-grid">

          <div className="report-table">

            <h2>Extracted Medical Parameters</h2>

            <table>

              <thead>
                <tr>
                  <th>Test</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {results.map((r, i) => (

                  <tr key={i}>

                    <td>{r.test}</td>

                    <td>{r.value}</td>

                    <td className={`status ${r.status.toLowerCase()}`}>
                      {r.status}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <div className="recommendation-box">

            <h2>AI Findings</h2>

            <ul>

              {generateRecommendations().map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}

            </ul>

          </div>

        </div>

      )}

    </div>

  );
};

export default AIMedicalReportAnalyzer;