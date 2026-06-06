import React from 'react';
import VotingChart from '../components/analytics/VotingChart';
import SentimentTimeline from '../components/analytics/SentimentTimeline';
import InfluenceRanking from '../components/analytics/InfluenceRanking';
import PublicOpinionGauge from '../components/analytics/PublicOpinionGauge';

const Analytics = ({ debateData }) => {
  if (!debateData) {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="bi bi-graph-up text-4xl"></i>
        <p className="mt-3">Start a debate to see analytics</p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="heading-2">Advanced Analytics Dashboard</h2>
        <p className="text-gray-400 text-sm">Comprehensive debate metrics and insights</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">Voting Distribution</h3>
          <VotingChart votes={debateData.voting_results.votes} />
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">Sentiment Timeline</h3>
          <SentimentTimeline history={debateData.sentiment_history} />
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">Influence Ranking</h3>
          <InfluenceRanking agents={debateData.agent_participation} />
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">Public Opinion</h3>
          <PublicOpinionGauge value={debateData.public_opinion} />
        </div>
      </div>

      {/* Party-wise Analysis */}
      {debateData.voting_results?.party_breakdown && (
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">Party-wise Voting Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 text-gray-500">Party</th>
                  <th className="text-right py-2 text-gray-500">Seats</th>
                  <th className="text-right py-2 text-green-500">For</th>
                  <th className="text-right py-2 text-red-500">Against</th>
                  <th className="text-right py-2 text-yellow-500">Abstain</th>
                  <th className="text-right py-2 text-primary-400">Support %</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(debateData.voting_results.party_breakdown).map(([party, data]) => (
                  <tr key={party} className="border-b border-gray-800/50">
                    <td className="py-2 font-medium">{party}</td>
                    <td className="text-right text-gray-400">{data.total_seats}</td>
                    <td className="text-right text-green-500">{data.for}</td>
                    <td className="text-right text-red-500">{data.against}</td>
                    <td className="text-right text-yellow-500">{data.abstain}</td>
                    <td className="text-right text-primary-400">{data.support_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;