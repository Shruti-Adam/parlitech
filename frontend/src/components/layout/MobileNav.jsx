import React from 'react';
import { motion } from 'framer-motion';

const MobileNav = ({ activePage, onPageChange }) => {
  const bottomItems = [
    { id: 'dashboard', label: 'Home', icon: 'bi-speedometer2' },
    { id: 'live', label: 'Debate', icon: 'bi-mic' },
    { id: 'chamber', label: 'Chamber', icon: 'bi-building' },
    { id: 'analytics', label: 'Stats', icon: 'bi-graph-up' },
    { id: 'insights', label: 'AI', icon: 'bi-robot' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around items-center py-2 z-40 md:hidden">
      {bottomItems.map((item) => (
        <motion.button
          key={item.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(item.id)}
          className={`flex flex-col items-center justify-center p-2 min-w-[44px] transition-colors ${
            activePage === item.id ? 'text-primary-500' : 'text-gray-500'
          }`}
        >
          <i className={`${item.icon} text-xl`}></i>
          <span className="text-[10px] mt-1">{item.label}</span>
        </motion.button>
      ))}
    </nav>
  );
};

export default MobileNav;