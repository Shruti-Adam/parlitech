import React from 'react';
import { motion } from 'framer-motion';

const DebateControls = ({ 
  isPlaying, 
  onPlay, 
  onPause, 
  onStop, 
  onPrevious, 
  onNext, 
  onReplay,
  currentIndex,
  totalSpeeches 
}) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-center space-x-2 md:space-x-4">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="p-2 md:p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 transition tap-target"
        >
          <i className="bi bi-skip-backward-fill text-lg md:text-xl"></i>
        </button>
        
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="p-3 md:p-4 bg-primary-600 hover:bg-primary-700 rounded-full transition tap-target"
          >
            <i className="bi bi-play-fill text-xl md:text-2xl"></i>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="p-3 md:p-4 bg-yellow-600 hover:bg-yellow-700 rounded-full transition tap-target"
          >
            <i className="bi bi-pause-fill text-xl md:text-2xl"></i>
          </button>
        )}
        
        <button
          onClick={onStop}
          className="p-2 md:p-3 bg-red-600 hover:bg-red-700 rounded-lg transition tap-target"
        >
          <i className="bi bi-stop-fill text-lg md:text-xl"></i>
        </button>
        
        <button
          onClick={onNext}
          disabled={currentIndex === totalSpeeches - 1}
          className="p-2 md:p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 transition tap-target"
        >
          <i className="bi bi-skip-forward-fill text-lg md:text-xl"></i>
        </button>
        
        <button
          onClick={onReplay}
          className="p-2 md:p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition tap-target"
        >
          <i className="bi bi-arrow-repeat text-lg md:text-xl"></i>
        </button>
      </div>
      
      <div className="mt-3 text-center text-xs text-gray-500">
        Speech {currentIndex + 1} of {totalSpeeches}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-2">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalSpeeches) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DebateControls;