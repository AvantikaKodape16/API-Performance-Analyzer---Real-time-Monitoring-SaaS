import React, { useState, useEffect } from 'react';
import PerformanceChart from './PerformanceChart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard({ endpoints }) {
  const [summary, setSummary] = useState(null);
  const [trendingData, setTrendingData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const summaryRes = await fetch('http://localhost:8000/api/dashboard/summary/');
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      const trendingRes = await fetch('http://localhost:8000/api/dashboard/trending/?hours=24');
      const trendingData = await trendingRes.json();
      setTrendingData(trendingData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!summary) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="card">
          <h3>Active Endpoints</h3>
          <p className="big-number">{summary.active_endpoints}</p>
          <span className="label">/ {summary.total_endpoints}</span>
        </div>
        <div className="card">
          <h3>Avg Response Time</h3>
          <p className="big-number">{summary.avg_response_time_ms.toFixed(2)}</p>
          <span className="label">ms</span>
        </div>
        <div className="card">
          <h3>Error Rate</h3>
          <p className="big-number">{summary.error_rate.toFixed(2)}%</p>
          <span className="label">{summary.error_count} errors</span>
        </div>
        <div className="card">
          <h3>Total Requests</h3>
          <p className="big-number">{summary.total_metrics}</p>
          <span className="label">last 24h</span>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Response Time Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avg_response_time"
                stroke="#8884d8"
                dot={false}
                name="Avg Response Time (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Errors by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="error_count" fill="#ff7300" name="Error Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;