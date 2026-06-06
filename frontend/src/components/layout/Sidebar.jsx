import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activePage, onPageChange, isMobile, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: 'bi-speedometer2', path: '/' },
    { id: 'live', label: 'LIVE DEBATE', icon: 'bi-mic', path: '/debate' },
    { id: 'chamber', label: '3D CHAMBER', icon: 'bi-building', path: '/chamber' },
    { id: 'analytics', label: 'ANALYTICS', icon: 'bi-graph-up', path: '/analytics' },
    { id: 'voting', label: 'VOTING', icon: 'bi-check2-square', path: '/voting' },
    { id: 'insights', label: 'AI INSIGHTS', icon: 'bi-robot', path: '/insights' },
    { id: 'simulator', label: 'POLICY SIM', icon: 'bi-calculator', path: '/simulator' },
    { id: 'research', label: 'RESEARCH', icon: 'bi-journal-bookmark', path: '/research' },
    { id: 'reports', label: 'REPORTS', icon: 'bi-file-text', path: '/reports' },
    { id: 'settings', label: 'SETTINGS', icon: 'bi-gear', path: '/settings' },
  ];

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <i className="bi bi-building text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">PARLITECH</h1>
            <p className="text-xs text-gray-500 hidden lg:block">AI Parliamentary Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onPageChange(item.id);
              if (isMobile && onClose) onClose();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
              activePage === item.id
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <i className={`${item.icon} text-lg min-w-[20px]`}></i>
            <span className="text-sm font-medium">{item.label}</span>
            {activePage === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto w-1 h-6 bg-white rounded-full"
              />
            )}
          </motion.button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-500 space-y-2">
        <div className="flex justify-between">
          <span>System Status</span>
          <span className="text-success">Active</span>
        </div>
        <div className="flex justify-between">
          <span>AI Agents</span>
          <span className="text-primary-400">15 Active</span>
        </div>
        <div className="flex justify-between">
          <span>MPs</span>
          <span>245</span>
        </div>
        <div className="flex justify-between">
          <span>Research Mode</span>
          <span className="text-info">M.Tech Project</span>
        </div>
      </div>
    </>
  );

  // Desktop sidebar - always visible
  if (!isMobile) {
    return (
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col overflow-y-auto">
        {sidebarContent}
      </aside>
    );
  }

  // Mobile sidebar - slide-out menu
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50"
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <i className="bi bi-building text-white text-xl"></i>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">PARLITECH</h1>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
                <i className="bi bi-x-lg text-gray-400"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;