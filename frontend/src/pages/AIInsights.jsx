import React from 'react';

const AIInsights = ({ debateData, speeches }) => {
  if (!debateData) {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="bi bi-robot text-4xl"></i>
        <p className="mt-3">Start a debate to generate AI insights</p>
      </div>
    );
  }

  // Find top supporting and opposing arguments
  const supportingSpeeches = speeches.filter(s => s.voting_tendency === 'for');
  const opposingSpeeches = speeches.filter(s => s.voting_tendency === 'against');

  const topSupporters = supportingSpeeches.slice(0, 3);
  const topOpposers = opposingSpeeches.slice(0, 3);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="heading-2">AI Insights Center</h2>
        <p className="text-gray-400 text-sm">Intelligent analysis and recommendations</p>
      </div>

      {/* Executive Summary */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-white mb-3">Executive Summary</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          The parliamentary debate on the proposed legislation has concluded with a <strong className={debateData.voting_results.status === 'PASSED' ? 'text-success' : 'text-error'}>
            {debateData.voting_results.status}
          </strong> outcome. 
          The government secured {debateData.voting_results.votes.for} votes against {debateData.voting_results.votes.against} opposition votes, 
          with {debateData.voting_results.votes.abstain} abstentions. The debate showed a {debateData.sentiment_analysis.trend} sentiment trend 
          with {((debateData.public_opinion || 0) * 100).toFixed(1)}% public approval.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Supporting Arguments */}
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-success mb-3">
            <i className="bi bi-check-circle-fill mr-2"></i>Top Supporting Arguments
          </h3>
          <div className="space-y-3">
            {topSupporters.map((speech, idx) => (
              <div key={idx} className="border-l-2 border-success pl-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-white text-sm">{speech.agent_name}</span>
                  <span className="text-xs text-gray-500">{speech.agent_role}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{speech.speech_text.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Opposing Arguments */}
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-error mb-3">
            <i className="bi bi-x-circle-fill mr-2"></i>Top Opposing Arguments
          </h3>
          <div className="space-y-3">
            {topOpposers.map((speech, idx) => (
              <div key={idx} className="border-l-2 border-error pl-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-white text-sm">{speech.agent_name}</span>
                  <span className="text-xs text-gray-500">{speech.agent_role}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{speech.speech_text.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-white mb-3">Key Findings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <i className="bi bi-bar-chart text-primary-400"></i>
            <div>
              <p className="text-sm text-gray-300">Average Sentiment</p>
              <p className="text-lg font-bold text-primary-400">{((debateData.sentiment_analysis.average || 0) * 100).toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <i className="bi bi-people text-primary-400"></i>
            <div>
              <p className="text-sm text-gray-300">Public Approval</p>
              <p className="text-lg font-bold text-primary-400">{((debateData.public_opinion || 0) * 100).toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <i className="bi bi-shield text-primary-400"></i>
            <div>
              <p className="text-sm text-gray-300">Coalition Strength</p>
              <p className="text-lg font-bold text-primary-400">{((debateData.voting_results.coalitions?.NDA / 245) * 100).toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <i className="bi bi-graph-up text-primary-400"></i>
            <div>
              <p className="text-sm text-gray-300">Debate Volatility</p>
              <p className="text-lg font-bold text-primary-400">{((debateData.sentiment_analysis.volatility || 0) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Verdict */}
      <div className={`rounded-lg p-4 text-center ${debateData.voting_results.status === 'PASSED' ? 'bg-success/10 border border-success/30' : 'bg-error/10 border border-error/30'}`}>
        <i className={`bi ${debateData.voting_results.status === 'PASSED' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} text-2xl mb-2 ${debateData.voting_results.status === 'PASSED' ? 'text-success' : 'text-error'}`}></i>
        <h3 className="font-bold text-white">Final Verdict</h3>
        <p className="text-sm text-gray-300 mt-1">
          {debateData.voting_results.status === 'PASSED' 
            ? 'The bill has sufficient support to become law. Recommended for implementation with suggested amendments.' 
            : 'The bill lacks required majority. Consider revision and reintroduction in next session.'}
        </p>
      </div>
    </div>
  );
};

export default AIInsights;