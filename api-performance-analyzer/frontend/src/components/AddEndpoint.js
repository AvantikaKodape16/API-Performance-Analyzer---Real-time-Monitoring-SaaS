import React, { useState } from 'react';

function AddEndpoint({ onAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'GET',
    alert_threshold_ms: 1000,
    headers: '{}',
    body: '{}',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        alert_threshold_ms: parseInt(formData.alert_threshold_ms),
        headers: JSON.parse(formData.headers),
        body: JSON.parse(formData.body),
      };

      const response = await fetch('http://localhost:8000/api/monitor/endpoints/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to add endpoint');
      }

      setFormData({
        name: '',
        url: '',
        method: 'GET',
        alert_threshold_ms: 1000,
        headers: '{}',
        body: '{}',
      });

      alert('✅ Endpoint added successfully!');
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-endpoint-container">
      <h2>Add New API Endpoint</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="endpoint-form">
        <div className="form-group">
          <label>Endpoint Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., User API"
            required
          />
        </div>

        <div className="form-group">
          <label>URL *</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://api.example.com/users"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>HTTP Method</label>
            <select name="method" value={formData.method} onChange={handleChange}>
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </select>
          </div>

          <div className="form-group">
            <label>Alert Threshold (ms)</label>
            <input
              type="number"
              name="alert_threshold_ms"
              value={formData.alert_threshold_ms}
              onChange={handleChange}
              placeholder="1000"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Headers (JSON)</label>
          <textarea
            name="headers"
            value={formData.headers}
            onChange={handleChange}
            placeholder='{"Authorization": "Bearer token"}'
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Body (JSON)</label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder='{"key": "value"}'
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Adding...' : '+ Add Endpoint'}
        </button>
      </form>
    </div>
  );
}

export default AddEndpoint;