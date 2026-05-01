import React from 'react';

function PerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="performance-chart">
      {/* Chart implementation can be extended */}
      <p>Performance Chart</p>
    </div>
  );
}

export default PerformanceChart;