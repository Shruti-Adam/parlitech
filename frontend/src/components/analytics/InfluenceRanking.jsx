// src/components/analytics/InfluenceRanking.jsx
import React from 'react';
import { motion } from 'framer-motion';

const InfluenceRanking = ({ agents }) => {
  const sorted = [...agents].sort((a, b) => b.influence_score - a.influence_score).slice(0, 10);

  return (
    <div className="space-y-2">
      {sorted.map((agent, idx) => (
        <motion.div
          key={agent.agent_id}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-xs text-gray-500 w-6">{idx + 1}</span>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{agent.name}</span>
                <span className="text-primary-400">{agent.influence_score}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${agent.influence_score}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InfluenceRanking;