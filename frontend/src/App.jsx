import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

// Page Components
import Dashboard from './pages/Dashboard';
import LiveDebate from './pages/LiveDebate';
import ChamberView from './pages/ChamberView';
import Analytics from './pages/Analytics';
import Voting from './pages/Voting';
import AIInsights from './pages/AIInsights';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import BillUpload from './pages/BillUpload';
import ResearchPaper from './pages/ResearchPaper';

// Voice & Notification Components - Make sure these files exist
import ToastNotifications from './components/notifications/ToastNotifications';
import LiveSpeaker from './components/voice/LiveSpeaker';
import DebateControls from './components/voice/DebateControls';

// Hooks & Services
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { settingsAPI } from './services/api';

const API_URL = 'http://localhost:8000';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [debateData, setDebateData] = useState(null);
  const [speeches, setSpeeches] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [debateActive, setDebateActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [appSettings, setAppSettings] = useState(null);
  
  const { speak, stop, speaking, supported, updateSettings } = useSpeechSynthesis();

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response && response.data) {
        setAppSettings(response.data);
        updateSettings({
          rate: response.data.voice_speed || 0.85,
          volume: response.data.voice_volume || 1.0,
          pitch: response.data.voice_pitch || 1.0
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Use default settings if API fails
      setAppSettings({
        voice_speed: 0.85,
        voice_volume: 1.0,
        voice_pitch: 1.0,
        notifications_enabled: true
      });
    }
  };

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play speeches when debate starts
  useEffect(() => {
    if (speeches.length > 0 && !isPlaying && debateActive) {
      startSpeechPlayback();
    }
  }, [speeches, debateActive]);

  const startSpeechPlayback = () => {
    setIsPlaying(true);
    setCurrentSpeechIndex(0);
  };

  const playCurrentSpeech = (index) => {
    if (index < speeches.length) {
      const speech = speeches[index];
      setCurrentSpeaker(speech);
      addNotification('info', 'Speaker Changed', `${speech.agent_name} (${speech.agent_role}) is now speaking`);
      
      if (supported && speech.speech_text) {
        speak(speech.speech_text, () => {
          const nextIndex = index + 1;
          if (nextIndex < speeches.length) {
            setCurrentSpeechIndex(nextIndex);
            playCurrentSpeech(nextIndex);
          } else {
            setIsPlaying(false);
            setCurrentSpeaker(null);
            setDebateActive(false);
            addNotification('success', 'Debate Completed', 'All speeches have been delivered');
          }
        });
      } else {
        // Auto-advance without voice
        setTimeout(() => {
          const nextIndex = index + 1;
          if (nextIndex < speeches.length) {
            setCurrentSpeechIndex(nextIndex);
            playCurrentSpeech(nextIndex);
          } else {
            setIsPlaying(false);
            setCurrentSpeaker(null);
            setDebateActive(false);
          }
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && speeches.length > 0 && currentSpeechIndex < speeches.length) {
      playCurrentSpeech(currentSpeechIndex);
    }
  }, [isPlaying, currentSpeechIndex, speeches]);

  const addNotification = (type, title, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    if (appSettings?.notifications_enabled) {
      if (type === 'error') toast.error(message);
      else if (type === 'success') toast.success(message);
      else toast(message);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const startDebate = async () => {
    if (!topic.trim()) {
      addNotification('error', 'Error', 'Please enter a bill topic');
      return;
    }
    
    setLoading(true);
    setDebateActive(true);
    setSpeeches([]);
    setDebateData(null);
    setCurrentSpeechIndex(0);
    
    addNotification('info', 'Debate Started', `Initiating parliamentary debate on: ${topic}`);
    
    try {
      const response = await axios.post(`${API_URL}/api/debate/start`, { topic });
      setDebateData(response.data);
      addNotification('success', 'API Connected', 'Debate data received successfully');
      
      if (response.data.speeches && response.data.speeches.length > 0) {
        setSpeeches(response.data.speeches);
        addNotification('info', 'Speeches Loaded', `${response.data.speeches.length} speeches ready`);
      } else {
        addNotification('warning', 'No Speeches', 'No speech data received from server');
        setDebateActive(false);
      }
    } catch (error) {
      console.error('Error:', error);
      addNotification('error', 'Connection Error', 'Failed to connect to backend server. Make sure it\'s running on port 8000');
      setDebateActive(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (speeches.length > 0) {
      setIsPlaying(true);
      if (currentSpeechIndex === 0) {
        playCurrentSpeech(0);
      } else {
        playCurrentSpeech(currentSpeechIndex);
      }
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    stop();
  };

  const handleStop = () => {
    setIsPlaying(false);
    stop();
    setCurrentSpeaker(null);
    setCurrentSpeechIndex(0);
  };

  const handlePrevious = () => {
    if (currentSpeechIndex > 0) {
      stop();
      const newIndex = currentSpeechIndex - 1;
      setCurrentSpeechIndex(newIndex);
      playCurrentSpeech(newIndex);
    }
  };

  const handleNext = () => {
    if (currentSpeechIndex < speeches.length - 1) {
      stop();
      const newIndex = currentSpeechIndex + 1;
      setCurrentSpeechIndex(newIndex);
      playCurrentSpeech(newIndex);
    }
  };

  const handleReplay = () => {
    if (currentSpeaker && currentSpeaker.speech_text) {
      stop();
      speak(currentSpeaker.speech_text);
    }
  };

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard':
        return <Dashboard debateData={debateData} onStartDebate={startDebate} topic={topic} setTopic={setTopic} loading={loading} />;
      case 'live':
        return (
          <div className="flex flex-col lg:flex-row gap-4 p-3 md:p-6">
            <div className="flex-1">
              <LiveDebate speeches={speeches} currentSpeaker={currentSpeaker} />
            </div>
            <div className="w-full lg:w-96 space-y-4">
              <LiveSpeaker currentSpeaker={currentSpeaker} />
              <DebateControls
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                onStop={handleStop}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onReplay={handleReplay}
                currentIndex={currentSpeechIndex}
                totalSpeeches={speeches.length}
              />
            </div>
          </div>
        );
      case 'chamber':
        return <ChamberView activeSpeaker={currentSpeaker} votingResults={debateData?.voting_results} />;
      case 'analytics':
        return <Analytics debateData={debateData} />;
      case 'voting':
        return <Voting votingResults={debateData?.voting_results} partyBreakdown={debateData?.voting_results?.party_breakdown} />;
      case 'insights':
        return <AIInsights debateData={debateData} speeches={speeches} />;
      case 'reports':
        return <Reports debateData={debateData} speeches={speeches} />;
      case 'settings':
        return <Settings />;
      case 'bill-upload':
        return <BillUpload />;
      case 'research':
        return <ResearchPaper debateData={debateData} speeches={speeches} />;
      default:
        return <Dashboard debateData={debateData} onStartDebate={startDebate} topic={topic} setTopic={setTopic} loading={loading} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
      {notifications.length > 0 && (
        <ToastNotifications notifications={notifications} onRemove={removeNotification} />
      )}
      
      <Header 
        sessionStatus={debateActive ? 'active' : 'inactive'} 
        onRefresh={() => window.location.reload()} 
        onMenuClick={() => setIsSidebarOpen(true)}
        isMobile={isMobile}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activePage={activePage} 
          onPageChange={setActivePage} 
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {isMobile && <MobileNav activePage={activePage} onPageChange={setActivePage} />}
    </div>
  );
}

export default App;