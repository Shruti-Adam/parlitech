import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SentimentTimeline = ({ history }) => {
  const data = {
    labels: history.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Sentiment Score',
        data: history,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: history.map(v => v > 0.1 ? '#10b981' : v < -0.1 ? '#ef4444' : '#f59e0b'),
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' } },
      x: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' } },
    },
    plugins: { legend: { labels: { color: '#9ca3af' } } },
  };

  return <Line data={data} options={options} />;
};

export default SentimentTimeline;