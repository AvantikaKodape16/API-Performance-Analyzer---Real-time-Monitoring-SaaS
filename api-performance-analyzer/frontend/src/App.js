import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AddEndpoint from './components/AddEndpoint';
import EndpointList from './components/EndpointList';
import AlertPanel from './components/AlertPanel';
import './styles/App.css';

function App() {
  const [endpoints, setEndpoints] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchEndpoints();
    fetchAlerts();
    const interval = setInterval(() => {
      fetchEndpoints();
      fetchAlerts();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchEndpoints = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/monitor/endpoints/');
      const data = await response.json();
      setEndpoints(data.results || data);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/monitor/alerts/active/');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleEndpointAdded = () => {
    fetchEndpoints();
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 API Performance Analyzer</h1>
        <p>Real-time monitoring & analytics for your APIs</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'endpoints' ? 'active' : ''}`}
          onClick={() => setActiveTab('endpoints')}
        >
          Endpoints ({endpoints.length})
        </button>
        <button
          className={`nav-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts ({alerts.length})
        </button>
        <button
          className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          + Add Endpoint
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard endpoints={endpoints} />}
        {activeTab === 'endpoints' && (
          <EndpointList endpoints={endpoints} onRefresh={fetchEndpoints} />
        )}
        {activeTab === 'alerts' && <AlertPanel alerts={alerts} />}
        {activeTab === 'add' && <AddEndpoint onAdded={handleEndpointAdded} />}
      </main>
    </div>
  );
}

export default App;