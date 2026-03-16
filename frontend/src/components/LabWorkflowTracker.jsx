import React, { useState } from "react";
import "./LabWorkflowTracker.css";

const workflowStages = [
  {
    title: "Sample Collected",
    description:
      "Patient sample has been collected at the laboratory reception and labeled with a unique ID.",
  },
  {
    title: "Initial Lab Testing",
    description:
      "Laboratory technicians perform biochemical and hematology testing using automated analyzers.",
  },
  {
    title: "AI Analysis",
    description:
      "AI models analyze extracted laboratory parameters to detect abnormalities and patterns.",
  },
  {
    title: "Doctor Review",
    description:
      "A medical specialist reviews the AI findings and validates the report results.",
  },
  {
    title: "Report Generated",
    description:
      "Final laboratory report is generated and delivered to the patient portal.",
  },
];

const fakeLogs = [
  "Sample received at laboratory reception.",
  "Barcode assigned to sample container.",
  "Sample transferred to biochemistry department.",
  "Automated analyzer started processing.",
  "AI diagnostic engine evaluating results.",
  "Doctor notified for final validation.",
];

const LabWorkflowTracker = () => {
  const [sampleId, setSampleId] = useState("");
  const [currentStage, setCurrentStage] = useState(null);
  const [notes, setNotes] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = () => {
    if (!sampleId) return;

    const randomStage = Math.floor(Math.random() * workflowStages.length);

    setCurrentStage(randomStage);
    setShowDetails(true);
  };

  return (
    <div className="workflow-wrapper">
      <div className="workflow-header">
        <h1>Smart Laboratory Workflow Tracker</h1>
        <p>
          Monitor the complete lifecycle of laboratory samples from collection
          to AI-assisted analysis and report generation.
        </p>
      </div>

      {/* SEARCH PANEL */}

      <div className="tracker-search-panel">
        <input
  type="text"
  placeholder="Enter Sample ID"
  list="sampleSuggestions"
  value={sampleId}
  onChange={(e) => setSampleId(e.target.value)}
/>

<datalist id="sampleSuggestions">
  <option value="LAB-2043" />
  <option value="LAB-2024-558" />
  <option value="MED-8901" />
  <option value="BLD-7742" />
  <option value="AI-LAB-1021" />
</datalist>

        <button onClick={handleSearch}>Track Sample</button>
      </div>

      {showDetails && (
        <div className="workflow-main-grid">
          {/* LEFT PANEL */}

          <div className="workflow-left">

            <div className="sample-info-card">
              <h2>Sample Information</h2>

              <div className="sample-grid">
                <div>
                  <span>Sample ID</span>
                  <p>{sampleId}</p>
                </div>

                <div>
                  <span>Patient Name</span>
                  <p>John Doe</p>
                </div>

                <div>
                  <span>Sample Type</span>
                  <p>Blood</p>
                </div>

                <div>
                  <span>Collection Time</span>
                  <p>09:35 AM</p>
                </div>

                <div>
                  <span>Department</span>
                  <p>Clinical Biochemistry</p>
                </div>

                <div>
                  <span>Priority</span>
                  <p className="priority">High</p>
                </div>
              </div>
            </div>

            {/* WORKFLOW TIMELINE */}

            <div className="timeline-card">
              <h2>Laboratory Workflow Progress</h2>

              <div className="timeline">

                {workflowStages.map((stage, index) => (
                  <div
                    key={index}
                    className={`timeline-step ${
                      index <= currentStage ? "active" : ""
                    }`}
                  >
                    <div className="timeline-circle">{index + 1}</div>

                    <div className="timeline-content">
                      <h3>{stage.title}</h3>
                      <p>{stage.description}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}

          <div className="workflow-right">

            {/* AI STATUS */}

            <div className="ai-status-card">
              <h2>AI Diagnostic Engine</h2>

              <p>
                The AI engine processes laboratory parameters and identifies
                abnormal patterns using predictive models trained on clinical
                datasets.
              </p>

              <div className="ai-status-box">
                <span>Status</span>
                <p>
                  {currentStage >= 2
                    ? "AI Analysis Completed"
                    : "Awaiting Data"}
                </p>
              </div>
            </div>

            {/* TECHNICIAN NOTES */}

            <div className="notes-card">
              <h2>Technician Notes</h2>

              <textarea
                placeholder="Enter technician observations or remarks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>

              <button>Save Notes</button>
            </div>

            {/* ACTIVITY LOG */}

            <div className="activity-card">
              <h2>Activity Log</h2>

              <ul>
                {fakeLogs.map((log, i) => (
                  <li key={i}>{log}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabWorkflowTracker;