// src/components/debate/DebateFeed.jsx
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SpeechCard = ({ speech, index, isLatest }) => {
  const getSentimentColor = (score) => {
    if (score > 0.1) return 'success';
    if (score < -0.1) return 'error';
    return 'warning';
  };

  const getVoteBadge = (tendency) => {
    switch(tendency) {
      case 'for': return { icon: 'bi-check-lg', color: 'success', text: 'FOR' };
      case 'against': return { icon: 'bi-x-lg', color: 'error', text: 'AGAINST' };
      default: return { icon: 'bi-dash-lg', color: 'warning', text: 'ABSTAIN' };
    }
  };

  const voteBadge = getVoteBadge(speech.voting_tendency);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`speech-card speech-card-${getSentimentColor(speech.sentiment_score)} bg-gray-900 border border-gray-800 rounded-lg p-4 mb-3 hover:border-gray-700 transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
            <i className="bi bi-person-circle fs-4 text-gray-400"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-white text-sm">{speech.agent_name}</h4>
              <span className="text-xs text-gray-500">{speech.agent_role}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-300">{speech.party}</span>
              <span className="text-xs text-primary-400">INF: {speech.influence_score}</span>
              <span className={`text-xs text-${voteBadge.color}`}>
                <i className={`${voteBadge.icon} mr-1`}></i>
                {voteBadge.text}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">{new Date(speech.timestamp).toLocaleTimeString()}</div>
          <div className={`text-xs text-${getSentimentColor(speech.sentiment_score)} mt-1`}>
            SENT: {((speech.sentiment_score || 0) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{speech.speech_text}</p>
      {isLatest && (
        <div className="mt-3 pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-primary-400">Currently Speaking</span>
            </div>
            <i className="bi bi-mic-fill text-primary-500"></i>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const DebateFeed = ({ speeches, filters, onFilterChange }) => {
  const feedRef = useRef(null);
  const [filteredSpeeches, setFilteredSpeeches] = React.useState([]);

  useEffect(() => {
    let filtered = [...speeches];
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(s => s.agent_role === filters.role);
    }
    if (filters.party && filters.party !== 'all') {
      filtered = filtered.filter(s => s.party === filters.party);
    }
    if (filters.sentiment && filters.sentiment !== 'all') {
      if (filters.sentiment === 'positive') filtered = filtered.filter(s => s.sentiment_score > 0.1);
      else if (filters.sentiment === 'negative') filtered = filtered.filter(s => s.sentiment_score < -0.1);
      else filtered = filtered.filter(s => Math.abs(s.sentiment_score) <= 0.1);
    }
    setFilteredSpeeches(filtered);
  }, [speeches, filters]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [speeches]);

  const uniqueRoles = [...new Set(speeches.map(s => s.agent_role))];
  const uniqueParties = [...new Set(speeches.map(s => s.party))];

  return (
    <div className="h-full flex flex-col">
      {/* Filter Bar */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">DEBATE TRANSCRIPT</h3>
          <div className="text-xs text-gray-500">{filteredSpeeches.length} speeches</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.role}
            onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
            className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-300"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            value={filters.party}
            onChange={(e) => onFilterChange({ ...filters, party: e.target.value })}
            className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-300"
          >
            <option value="all">All Parties</option>
            {uniqueParties.map(party => (
              <option key={party} value={party}>{party}</option>
            ))}
          </select>
          <select
            value={filters.sentiment}
            onChange={(e) => onFilterChange({ ...filters, sentiment: e.target.value })}
            className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-300"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </div>

      {/* Feed Content */}
      <div ref={feedRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {filteredSpeeches.map((speech, idx) => (
            <SpeechCard
              key={speech.speech_order || idx}
              speech={speech}
              index={idx}
              isLatest={idx === filteredSpeeches.length - 1}
            />
          ))}
        </AnimatePresence>
        {filteredSpeeches.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <i className="bi bi-chat-dots fs-1"></i>
            <p className="mt-2">No speeches match the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateFeed;