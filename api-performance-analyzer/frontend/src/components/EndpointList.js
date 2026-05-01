import React, { useState } from 'react';

function EndpointList({ endpoints, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null);
  const [metrics, setMetrics] = useState({});

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!metrics[id]) {
        fetchMetrics(id);
      }
    }
  };

  const fetchMetrics = async (endpointId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/monitor/endpoints/${endpointId}/performance_history/?hours=24`
      );
      const data = await response.json();
      setMetrics(prev => ({
        ...prev,
        [endpointId]: data,
      }));
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleStatusChange = async (endpointId, currentStatus) => {
    try {
      const action = currentStatus === 'active' ? 'pause_monitoring' : 'activate_monitoring';
      const response = await fetch(
        `http://localhost:8000/api/monitor/endpoints/${endpointId}/${action}/`,
        { method: 'POST' }
      );
      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error changing endpoint status:', error);
    }
  };

  return (
    <div className="endpoint-list-container">
      <h2>Monitored Endpoints</h2>
      {endpoints.length === 0 ? (
        <p className="empty-message">No endpoints added yet. Add one to get started!</p>
      ) : (
        <div className="endpoint-list">
          {endpoints.map(endpoint => (
            <div key={endpoint.id} className="endpoint-card">
              <div
                className="endpoint-header"
                onClick={() => toggleExpand(endpoint.id)}
              >
                <div className="endpoint-info">
                  <h3>{endpoint.name}</h3>
                  <p className="endpoint-url">{endpoint.method} {endpoint.url}</p>
                  <div className="endpoint-stats">
                    <span className={`status ${endpoint.status}`}>
                      {endpoint.status}
                    </span>
                    <span>Requests: {endpoint.total_requests}</span>
                    <span>Avg: {endpoint.avg_response_time.toFixed(2)}ms</span>
                    <span>Errors: {endpoint.error_rate.toFixed(2)}%</span>
                  </div>
                </div>
                <button
                  className={`status-btn ${endpoint.status}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(endpoint.id, endpoint.status);
                  }}
                >
                  {endpoint.status === 'active' ? 'Pause' : 'Resume'}
                </button>
              </div>

              {expandedId === endpoint.id && (
                <div className="endpoint-details">
                  <div className="metrics-summary">
                    <p><strong>Alert Threshold:</strong> {endpoint.alert_threshold_ms}ms</p>
                    <p><strong>Created:</strong> {new Date(endpoint.created_at).toLocaleString()}</p>
                    <p><strong>Updated:</strong> {new Date(endpoint.updated_at).toLocaleString()}</p>
                  </div>
                  {metrics[endpoint.id] && (
                    <div className="recent-metrics">
                      <h4>Recent Metrics ({metrics[endpoint.id].length})</h4>
                      <div className="metrics-list">
                        {metrics[endpoint.id].slice(0, 5).map((metric, idx) => (
                          <div key={idx} className={`metric-item ${metric.is_alert ? 'alert' : ''}`}>
                            <span>{new Date(metric.timestamp).toLocaleTimeString()}</span>
                            <span>{metric.response_time_ms.toFixed(2)}ms</span>
                            <span className={`status-code ${metric.status_code >= 400 ? 'error' : 'success'}`}>
                              {metric.status_code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EndpointList;