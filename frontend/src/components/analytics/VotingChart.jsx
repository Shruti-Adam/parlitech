// src/components/analytics/VotingChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const VotingChart = ({ votes }) => {
  const data = {
    labels: ['For', 'Against', 'Abstain'],
    datasets: [
      {
        data: [votes.for, votes.against, votes.abstain],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderColor: ['#059669', '#dc2626', '#d97706'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9ca3af', font: { size: 11 } },
      },
      tooltip: { backgroundColor: '#1f2937', titleColor: '#fff', bodyColor: '#9ca3af' },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default VotingChart;