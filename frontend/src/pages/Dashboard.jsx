import React from 'react';
import { motion } from 'framer-motion';
import VotingChart from '../components/analytics/VotingChart';
import SentimentTimeline from '../components/analytics/SentimentTimeline';
import InfluenceRanking from '../components/analytics/InfluenceRanking';
import PublicOpinionGauge from '../components/analytics/PublicOpinionGauge';

const Dashboard = ({ debateData, onStartDebate, topic, setTopic, loading }) => {
  const stats = [
    { label: 'AI Agents Active', value: '15', icon: 'bi-robot', color: 'primary' },
    { label: 'MPs Present', value: '245', icon: 'bi-people', color: 'info' },
    { label: 'Coalition Support', value: '67%', icon: 'bi-diagram-3', color: 'success' },
    { label: 'Debate Quality', value: 'A-', icon: 'bi-star', color: 'warning' },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h2 className="heading-1">Parliamentary Intelligence Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time multi-agent debate analytics</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <i className="bi bi-database"></i>
          <span>Research Mode: Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl md:text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
              </div>
              <i className={`${stat.icon} text-2xl md:text-3xl text-gray-700`}></i>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Debate Input Section */}
      {!debateData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6"
        >
          <h3 className="heading-3 mb-3">Initiate Legislative Debate</h3>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter Bill / Policy Title for Parliamentary Debate..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
            rows={3}
          />
          <button
            onClick={onStartDebate}
            disabled={loading}
            className="mt-4 btn-primary w-full md:w-auto disabled:opacity-50"
          >
            {loading ? (
              <><i className="bi bi-hourglass-split animate-spin mr-2"></i>Initializing Session...</>
            ) : (
              <><i className="bi bi-play-fill mr-2"></i>Start Parliamentary Debate</>
            )}
          </button>
        </motion.div>
      )}

      {/* Analytics Grid - Only show when debate exists */}
      {debateData && (
        <div className="dashboard-grid">
          {/* Voting Distribution */}
          <div className="stat-card col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Voting Distribution</h3>
              <i className="bi bi-pie-chart text-gray-500"></i>
            </div>
            <VotingChart votes={debateData.voting_results.votes} />
            <div className="mt-3 text-center">
              <div className={`text-lg font-bold ${debateData.voting_results.status === 'PASSED' ? 'text-success' : 'text-error'}`}>
                {debateData.voting_results.status}
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="stat-card col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Sentiment Analysis</h3>
              <i className="bi bi-graph-up text-gray-500"></i>
            </div>
            <SentimentTimeline history={debateData.sentiment_history} />
          </div>

          {/* Public Opinion */}
          <div className="stat-card col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Public Opinion</h3>
              <i className="bi bi-people text-gray-500"></i>
            </div>
            <PublicOpinionGauge value={debateData.public_opinion} />
          </div>

          {/* Influence Ranking */}
          <div className="stat-card col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Influence Ranking</h3>
              <i className="bi bi-trophy text-gray-500"></i>
            </div>
            <InfluenceRanking agents={debateData.agent_participation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;