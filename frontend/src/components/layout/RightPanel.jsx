// src/components/layout/RightPanel.jsx
import React from 'react';
import { motion } from 'framer-motion';

const RightPanel = ({ currentSpeaker, debateProgress, metrics }) => {
  return (
    <aside className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
      {/* Current Speaker */}
      <div className="p-4 border-b border-gray-800">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          <i className="bi bi-mic-fill mr-2"></i> CURRENT SPEAKER
        </div>
        {currentSpeaker ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <i className="bi bi-person fs-3 text-white"></i>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{currentSpeaker.agent_name}</h4>
                <p className="text-xs text-gray-400">{currentSpeaker.agent_role}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-700 rounded">{currentSpeaker.party}</span>
                  <span className="text-xs text-primary-400">Influence: {currentSpeaker.influence_score}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 30, ease: 'linear' }}
              />
            </div>
          </motion.div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-500">
            <i className="bi bi-mic-mute fs-3"></i>
            <p className="text-sm mt-2">No active speaker</p>
          </div>
        )}
      </div>

      {/* Debate Progress */}
      <div className="p-4 border-b border-gray-800">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          <i className="bi bi-bar-chart-steps mr-2"></i> DEBATE PROGRESS
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Speeches Completed</span>
              <span className="text-white font-medium">{debateProgress?.completed || 0} / 15</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((debateProgress?.completed || 0) / 15) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Public Opinion</span>
              <span className="text-white font-medium">{((debateProgress?.public_opinion || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-info rounded-full transition-all"
                style={{ width: `${((debateProgress?.public_opinion || 0) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="p-4 flex-1">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          <i className="bi bi-speedometer2 mr-2"></i> REAL-TIME METRICS
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Average Sentiment</span>
            <span className={`font-mono text-sm ${
              (metrics?.avgSentiment || 0) > 0.1 ? 'text-success' :
              (metrics?.avgSentiment || 0) < -0.1 ? 'text-error' : 'text-warning'
            }`}>
              {((metrics?.avgSentiment || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Debate Volatility</span>
            <span className="font-mono text-sm text-warning">
              {((metrics?.volatility || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Coalition Support</span>
            <span className="font-mono text-sm text-primary-400">
              {(metrics?.coalitionSupport || 0).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;