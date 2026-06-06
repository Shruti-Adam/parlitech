import React from 'react';

const ResearchCenter = ({ debateData }) => {
  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="heading-2">Research Center</h2>
        <p className="text-gray-400 text-sm">Academic analysis and research tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Methodology */}
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">Research Methodology</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p><span className="text-primary-400">Multi-Agent System:</span> 15 AI agents with distinct ideologies</p>
            <p><span className="text-primary-400">NLP Pipeline:</span> Sentiment analysis, argument mining, topic extraction</p>
            <p><span className="text-primary-400">Decision Intelligence:</span> Coalition formation, influence propagation</p>
            <p><span className="text-primary-400">Explainable AI:</span> Vote reasoning, bias detection</p>
          </div>
        </div>

        {/* Citation Generator */}
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">Citation Generator</h3>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400">APA</p>
              <p className="text-xs text-gray-300 mt-1">ParliTech (2024). AI-Powered Multi-Agent Parliamentary Intelligence System. M.Tech Research Project.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400">BibTeX</p>
              <pre className="text-xs text-gray-300 mt-1 font-mono whitespace-pre-wrap">
{`@misc{parlitech2024,
  title={ParliTech: AI-Powered Parliamentary Intelligence},
  year={2024},
  howpublished={\\url{https://parlitech.onrender.com}}
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Research Metrics */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-white mb-3">Research Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">15</div>
            <div className="text-xs text-gray-500">AI Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">245</div>
            <div className="text-xs text-gray-500">MPs Simulated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">10</div>
            <div className="text-xs text-gray-500">Debate Stages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">14</div>
            <div className="text-xs text-gray-500">Analytics Metrics</div>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-white mb-3">Academic References</h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li>• Wooldridge, M. (2009). An Introduction to MultiAgent Systems. Wiley.</li>
          <li>• Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach. Pearson.</li>
          <li>• Liu, B. (2015). Sentiment Analysis: Mining Opinions, Sentiments, and Emotions. Cambridge.</li>
          <li>• LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. Nature.</li>
        </ul>
      </div>
    </div>
  );
};

export default ResearchCenter;