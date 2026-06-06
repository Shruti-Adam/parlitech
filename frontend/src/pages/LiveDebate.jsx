import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LiveDebate = ({ speeches, currentSpeaker }) => {
  const feedRef = useRef(null);
  const [filters, setFilters] = useState({ role: 'all', party: 'all' });
  const [filteredSpeeches, setFilteredSpeeches] = useState([]);

  useEffect(() => {
    let filtered = [...speeches];
    if (filters.role !== 'all') {
      filtered = filtered.filter(s => s.agent_role === filters.role);
    }
    if (filters.party !== 'all') {
      filtered = filtered.filter(s => s.party === filters.party);
    }
    setFilteredSpeeches(filtered);
  }, [speeches, filters]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [speeches]);

  const uniqueRoles = [...new Set(speeches.map(s => s.agent_role))];
  const uniqueParties = [...new Set(speeches.map(s => s.party))];

  const debateStages = [
    'Speaker Opens Session',
    'Bill Introduction',
    'Government Arguments',
    'Opposition Arguments',
    'Expert Opinions',
    'Rebuttal Round',
    'Cross Examination',
    'Closing Statements',
    'Voting Phase',
    'Final Declaration'
  ];

  const currentStage = Math.min(Math.floor(speeches.length / 1.5), debateStages.length - 1);

  return (
    <div className="flex flex-col h-full">
      {/* Debate Progress Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-3 md:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h2 className="heading-2">Live Parliamentary Debate</h2>
            <p className="text-gray-400 text-sm">Multi-agent debate simulation in real-time</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Stage:</span>
            <span className="text-primary-400 font-medium">{debateStages[currentStage]}</span>
          </div>
        </div>
        
        {/* Stage Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Opening</span>
            <span>Debate</span>
            <span>Voting</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${(speeches.length / 15) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Speaker Indicator */}
      {currentSpeaker && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-600/10 border-b border-primary-500/30 p-3"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Currently Speaking:</span>
            <span className="font-medium text-primary-400">{currentSpeaker.agent_name}</span>
            <span className="text-xs text-gray-500">({currentSpeaker.agent_role})</span>
          </div>
        </motion.div>
      )}

      {/* Filter Bar */}
      <div className="p-3 md:p-4 border-b border-gray-800">
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="px-2 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            value={filters.party}
            onChange={(e) => setFilters({ ...filters, party: e.target.value })}
            className="px-2 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
          >
            <option value="all">All Parties</option>
            {uniqueParties.map(party => (
              <option key={party} value={party}>{party}</option>
            ))}
          </select>
          <div className="text-xs text-gray-500 ml-auto flex items-center">
            <i className="bi bi-chat-dots mr-1"></i>
            {filteredSpeeches.length} speeches
          </div>
        </div>
      </div>

      {/* Speech Feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
        {filteredSpeeches.map((speech, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`bg-gray-900 rounded-lg p-3 md:p-4 border-l-4 ${
              speech.sentiment_score > 0.1 ? 'border-success' :
              speech.sentiment_score < -0.1 ? 'border-error' : 'border-warning'
            } border border-gray-800 hover:border-gray-700 transition-all`}
          >
            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-bold text-white text-sm md:text-base">{speech.agent_name}</span>
                  <span className="text-xs text-gray-500">{speech.agent_role}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">{speech.party}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs">
                  <span className="text-primary-400">Influence: {speech.influence_score}</span>
                  <span className={`${
                    speech.sentiment_score > 0.1 ? 'text-success' :
                    speech.sentiment_score < -0.1 ? 'text-error' : 'text-warning'
                  }`}>
                    Sentiment: {((speech.sentiment_score || 0) * 100).toFixed(1)}%
                  </span>
                  <span className={`${
                    speech.voting_tendency === 'for' ? 'text-success' :
                    speech.voting_tendency === 'against' ? 'text-error' : 'text-warning'
                  }`}>
                    {speech.voting_tendency?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(speech.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mt-2">{speech.speech_text}</p>
          </motion.div>
        ))}
        
        {filteredSpeeches.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <i className="bi bi-chat-dots text-4xl"></i>
            <p className="mt-3">No speeches yet. Start a debate session.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveDebate;