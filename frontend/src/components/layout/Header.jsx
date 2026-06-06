import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Header = ({ sessionStatus, onRefresh, onMenuClick, isMobile }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
      <div className="px-3 sm:px-4 md:px-6 py-2 md:py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-800 rounded-lg tap-target"
            >
              <i className="bi bi-list text-gray-400 text-xl"></i>
            </button>
          )}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <i className="bi bi-building text-white text-base md:text-xl"></i>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-base md:text-xl font-bold text-white">PARLITECH</h1>
              <p className="text-[10px] md:text-xs text-gray-500 hidden sm:block">
                AI Parliamentary Intelligence System
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Session Info */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <i className="bi bi-calendar3 text-gray-500 text-sm"></i>
            <span className="text-sm text-gray-300">
              {currentTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="bi bi-clock text-gray-500 text-sm"></i>
            <span className="text-sm text-gray-300 font-mono">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-2 md:px-3 py-1 bg-gray-800 rounded-lg">
            <div className={`w-2 h-2 rounded-full animate-pulse ${sessionStatus === 'active' ? 'bg-success' : 'bg-gray-500'}`}></div>
            <span className="text-xs md:text-sm font-medium text-gray-300">
              {sessionStatus === 'active' ? 'LIVE SESSION' : 'READY'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <i className={`bi ${connectionStatus === 'connected' ? 'bi-wifi' : 'bi-wifi-off'} text-gray-500 text-sm md:text-base`}></i>
            <span className="text-xs text-gray-500 hidden lg:inline">
              {connectionStatus === 'connected' ? 'Connected' : 'Offline'}
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors tap-target"
          >
            <i className="bi bi-arrow-repeat text-gray-400 text-sm md:text-base"></i>
          </button>
        </div>
      </div>

      {/* Mobile Session Indicator */}
      {isMobile && (
        <div className="px-3 pb-2 flex items-center justify-between border-t border-gray-800 pt-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${sessionStatus === 'active' ? 'bg-success' : 'bg-gray-500'}`}></div>
            <span className="text-xs text-gray-400">
              {sessionStatus === 'active' ? 'Session Active' : 'System Ready'}
            </span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;