// src/components/analytics/SentimentChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SentimentChart = ({ history }) => {
  const data = {
    labels: history.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Sentiment Score',
        data: history,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: history.map(v => v > 0.1 ? '#10b981' : v < -0.1 ? '#ef4444' : '#f59e0b'),
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: { grid: { color: '#374151' }, title: { display: true, text: 'Sentiment Polarity', color: '#9ca3af' }, ticks: { color: '#9ca3af' } },
      x: { grid: { color: '#374151' }, title: { display: true, text: 'Speech Sequence', color: '#9ca3af' }, ticks: { color: '#9ca3af' } },
    },
    plugins: { legend: { labels: { color: '#9ca3af' } }, tooltip: { backgroundColor: '#1f2937' } },
  };

  return <Line data={data} options={options} />;
};

export default SentimentChart;