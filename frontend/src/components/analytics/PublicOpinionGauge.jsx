import React from 'react';

const PublicOpinionGauge = ({ value }) => {
  const percentage = value * 100;

  return (
    <div>
      <div className="text-center mb-2">
        <span className="text-2xl font-bold text-white">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-500 rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Oppose</span>
        <span>Neutral</span>
        <span>Support</span>
      </div>
    </div>
  );
};

export default PublicOpinionGauge;