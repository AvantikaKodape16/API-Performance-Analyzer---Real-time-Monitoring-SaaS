import React, { useState } from 'react';

function AlertPanel({ alerts }) {
  const handleResolveAlert = async (alertId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/monitor/alerts/${alertId}/resolve/`,
        { method: 'POST' }
      );
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/monitor/alerts/${alertId}/acknowledge/`,
        { method: 'POST' }
      );
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="alert-panel">
        <h2>Alerts</h2>
        <p className="empty-message">✅ No active alerts! Everything is running smoothly.</p>
      </div>
    );
  }

  return (
    <div className="alert-panel">
      <h2>Active Alerts ({alerts.length})</h2>
      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-item ${alert.alert_type}`}>
            <div className="alert-header">
              <h3>{alert.endpoint_name}</h3>
              <span className={`alert-type ${alert.alert_type}`}>{alert.alert_type}</span>
            </div>
            <p className="alert-message">{alert.message}</p>
            <p className="alert-time">
              {new Date(alert.triggered_at).toLocaleString()}
            </p>
            <div className="alert-actions">
              <button
                className="btn-secondary"
                onClick={() => handleAcknowledgeAlert(alert.id)}
              >
                Acknowledge
              </button>
              <button
                className="btn-primary"
                onClick={() => handleResolveAlert(alert.id)}
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertPanel;