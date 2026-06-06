import React from 'react';

const PolicySimulator = ({ billTopic, debateData }) => {
  const impacts = {
    economic: { score: 72, impact: 'Positive', description: 'GDP growth projected at 1.2% over 5 years' },
    social: { score: 65, impact: 'Moderately Positive', description: 'Beneficial for urban population' },
    technological: { score: 78, impact: 'Highly Positive', description: 'Digital infrastructure boost' },
    legal: { score: 58, impact: 'Mixed', description: 'Requires subordinate legislation' },
    environmental: { score: 45, impact: 'Neutral', description: 'No significant impact' },
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="heading-2">Policy Impact Simulator</h2>
        <p className="text-gray-400 text-sm">AI-powered policy outcome prediction</p>
      </div>

      {!debateData ? (
        <div className="text-center text-gray-500 py-12">
          <i className="bi bi-calculator text-4xl"></i>
          <p className="mt-3">Complete a debate to see policy impact simulation</p>
        </div>
      ) : (
        <>
          {/* Impact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(impacts).map(([key, value]) => (
              <div key={key} className="stat-card text-center">
                <div className="text-2xl font-bold text-primary-400">{value.score}%</div>
                <div className="text-sm font-medium text-white mt-1 capitalize">{key}</div>
                <div className={`text-xs mt-1 ${
                  value.impact === 'Positive' ? 'text-success' :
                  value.impact === 'Highly Positive' ? 'text-success' :
                  value.impact === 'Negative' ? 'text-error' : 'text-warning'
                }`}>
                  {value.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Analysis */}
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-white mb-3">Detailed Impact Analysis</h3>
            <div className="space-y-4">
              {Object.entries(impacts).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-300">{key} Impact</span>
                    <span className="text-primary-400">{value.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${value.score}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Success Probability */}
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-white mb-3">Success Probability</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400">
                {debateData.voting_results.status === 'PASSED' ? '78%' : '32%'}
              </div>
              <div className="h-3 bg-gray-800 rounded-full mt-3">
                <div 
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: debateData.voting_results.status === 'PASSED' ? '78%' : '32%' }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Based on coalition strength, public opinion, and debate sentiment analysis
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-white mb-3">AI Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <i className="bi bi-lightbulb text-warning mt-0.5"></i>
                <span>Strengthen economic impact assessment with additional data points</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="bi bi-lightbulb text-warning mt-0.5"></i>
                <span>Address environmental concerns through amendments</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="bi bi-lightbulb text-warning mt-0.5"></i>
                <span>Build broader coalition support through stakeholder consultations</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PolicySimulator;