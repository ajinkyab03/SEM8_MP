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

const diseaseData = [
  { name: "Diabetes", value: 45 },
  { name: "Heart Disease", value: 30 },
  { name: "Thyroid", value: 20 },
  { name: "Other", value: 15 },
];

const monthlyTests = [
  { month: "Jan", tests: 120 },
  { month: "Feb", tests: 150 },
  { month: "Mar", tests: 180 },
  { month: "Apr", tests: 210 },
  { month: "May", tests: 240 },
];

const accuracyData = [
  { day: "Mon", accuracy: 95 },
  { day: "Tue", accuracy: 96 },
  { day: "Wed", accuracy: 97 },
  { day: "Thu", accuracy: 98 },
  { day: "Fri", accuracy: 97 },
];

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

const SmartLabDashboard = () => {
  return (
    <div className="lab-dashboard">

      <h1 className="dashboard-title">Smart Lab Analytics Dashboard</h1>

      {/* Top Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Samples</h3>
          <p>1,245</p>
        </div>

        <div className="stat-card">
          <h3>Tests Today</h3>
          <p>84</p>
        </div>

        <div className="stat-card">
          <h3>AI Accuracy</h3>
          <p>97%</p>
        </div>

        <div className="stat-card">
          <h3>Pending Reports</h3>
          <p>12</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">

        {/* Pie Chart */}
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

        {/* Bar Chart */}
        <div className="chart-box">
          <h3>Monthly Tests</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tests" fill="#3f51b5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="chart-box">
          <h3>AI Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#00c853"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};

export default SmartLabDashboard;