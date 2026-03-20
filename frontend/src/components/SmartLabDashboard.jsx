import "./SmartLabDashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

/* ---------------- DATA ---------------- */

const diseaseData = [
  { name: "Diabetes", value: 45 },
  { name: "Heart Disease", value: 30 },
  { name: "Kidney", value: 20 },
  { name: "Other", value: 15 },
];

const monthlyTests = [
  { month: "Nov", tests: 40 },
  { month: "Dec", tests: 30 },
  { month: "Jan", tests: 43 },
  { month: "Feb", tests: 34 },
  { month: "Mar", tests: 16 },
];

const accuracyData = [
  { month: "Nov", accuracy: 80 },
  { month: "Dec", accuracy: 82 },
  { month: "Jan", accuracy: 81 },
  { month: "Feb", accuracy: 83 },
  { month: "Mar", accuracy: 81.5 },
];

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

/* ---------------- CALCULATIONS ---------------- */

const totalSamples = monthlyTests.reduce((sum, m) => sum + m.tests, 0);
const latestMonth = monthlyTests[monthlyTests.length - 1];
const latestAccuracy = accuracyData[accuracyData.length - 1].accuracy;

/* ---------------- COMPONENT ---------------- */

const SmartLabDashboard = () => {
  return (
    <div className="lab-dashboard">

      <h1 className="dashboard-title">🧠 Smart Lab Analytics Dashboard</h1>

      {/* ---------------- KPI CARDS ---------------- */}

      <div className="stats-container">

        <div className="stat-card gradient-green">
          <h3>Total Samples</h3>
          <p>{totalSamples}</p>
          <span className="growth positive">+12% ↑</span>
        </div>

        <div className="stat-card gradient-blue">
          <h3>Tests ({latestMonth.month})</h3>
          <p>{latestMonth.tests}</p>
          <span className="growth negative">-5% ↓</span>
        </div>

        <div className="stat-card gradient-purple">
          <h3>AI Accuracy</h3>
          <p>{latestAccuracy}%</p>
          <span className="growth positive">+2.1% ↑</span>
        </div>

        <div className="stat-card gradient-orange">
          <h3>Pending Reports</h3>
          <p>12</p>
          <span className="status-badge">Attention Needed</span>
        </div>

      </div>

      {/* ---------------- CHARTS ---------------- */}

      <div className="charts-container">

        {/* PIE */}

        <div className="chart-box">
          <h3>Disease Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}

        <div className="chart-box">
          <h3>Monthly Tests</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tests" fill="#3f51b5" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}

        <div className="chart-box">
          <h3>AI Accuracy Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[75, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#00c853"
                strokeWidth={4}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ---------------- AI INSIGHTS ---------------- */}

      <div className="insights-section">

        <h2>🤖 AI Insights</h2>

        <ul>
          <li>✔ Increase in diabetes cases observed in last 3 months</li>
          <li>✔ AI accuracy improving with more dataset training</li>
          <li>✔ Lab workload reduced by 18% using automation</li>
          <li>✔ Early detection rate improved significantly</li>
        </ul>

      </div>

    </div>
  );
};

export default SmartLabDashboard;