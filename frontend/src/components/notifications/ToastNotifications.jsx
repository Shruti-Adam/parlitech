import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastNotifications = ({ notifications, onRemove }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'error': return 'bi-x-circle-fill text-error';
      case 'warning': return 'bi-exclamation-triangle-fill text-warning';
      case 'info': return 'bi-info-circle-fill text-info';
      default: return 'bi-bell-fill text-primary-400';
    }
  };

  useEffect(() => {
    const timers = notifications.map(notif => {
      return setTimeout(() => {
        onRemove(notif.id);
      }, 5000);
    });
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [notifications, onRemove]);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3 min-w-[280px] max-w-[350px]"
          >
            <div className="flex items-start space-x-3">
              <i className={`${getIcon(notif.type)} text-xl`}></i>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{notif.title}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
              </div>
              <button onClick={() => onRemove(notif.id)} className="text-gray-500 hover:text-gray-300">
                <i className="bi bi-x-lg text-sm"></i>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotifications;