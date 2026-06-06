import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LiveSpeaker = ({ currentSpeaker, onEnd }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentSpeaker) {
      setIsActive(true);
      setTimeElapsed(0);
      
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      
      // Simulate speech duration (30 seconds average)
      const duration = setTimeout(() => {
        if (onEnd) onEnd();
      }, 30000);
      
      return () => {
        clearInterval(timer);
        clearTimeout(duration);
      };
    } else {
      setIsActive(false);
      setTimeElapsed(0);
    }
  }, [currentSpeaker, onEnd]);

  if (!currentSpeaker) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
        <i className="bi bi-mic-mute text-3xl text-gray-600"></i>
        <p className="text-gray-500 text-sm mt-2">No active speaker</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 border border-primary-500/30 rounded-lg p-4"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <i className="bi bi-person text-3xl text-white"></i>
          </div>
          {isActive && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-lg">{currentSpeaker.agent_name}</h3>
            <span className="text-xs text-red-500 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
              LIVE SPEAKING
            </span>
          </div>
          <p className="text-gray-400 text-sm">{currentSpeaker.agent_role}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs">
            <span className="text-primary-400">Party: {currentSpeaker.party}</span>
            <span className="text-primary-400">Influence: {currentSpeaker.influence_score}</span>
            <span className={`${
              currentSpeaker.sentiment_score > 0.1 ? 'text-green-500' :
              currentSpeaker.sentiment_score < -0.1 ? 'text-red-500' : 'text-yellow-500'
            }`}>
              Sentiment: {((currentSpeaker.sentiment_score || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Speaking Timer Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Speaking duration</span>
          <span>{timeElapsed}s / 30s</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(timeElapsed / 30) * 100}%` }}
            className="h-full bg-primary-500 rounded-full"
          />
        </div>
      </div>
      
      {/* Voice Wave Animation */}
      <div className="mt-3 flex items-center justify-center space-x-1 h-8">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-primary-500 rounded-full"
            animate={{
              height: isActive ? [10, 30, 10] : 5,
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LiveSpeaker;