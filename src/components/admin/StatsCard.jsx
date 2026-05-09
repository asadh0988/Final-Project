// StatsCard: displays a single stat
import React from 'react';

const StatsCard = ({ title, value }) => (
  <div className="stats-card">
    <h3>{title}</h3>
    <div className="value">{value}</div>
  </div>
);

export default StatsCard;
