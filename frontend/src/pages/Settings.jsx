import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

const Settings = () => {
  const { updateSettings } = useSpeechSynthesis();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    voice_speed: 0.85,
    voice_volume: 1.0,
    voice_pitch: 1.0,
    auto_scroll: true,
    realtime_updates: true,
    api_url: 'https://parlitech.onrender.com',
    notifications_enabled: true
  });

  // Load settings from backend
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data) {
        setSettings(response.data);
        updateSettings({
          rate: response.data.voice_speed,
          volume: response.data.voice_volume,
          pitch: response.data.voice_pitch
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await api.post('/settings', settings);
      updateSettings({
        rate: settings.voice_speed,
        volume: settings.voice_volume,
        pitch: settings.voice_pitch
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-gray-700'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="heading-2">System Settings</h2>
        <p className="text-gray-400 text-sm">Configure application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Voice Settings */}
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-4">Voice Settings</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Speech Speed</span>
                <span className="text-primary-400">{settings.voice_speed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={settings.voice_speed}
                onChange={(e) => handleChange('voice_speed', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Volume</span>
                <span className="text-primary-400">{Math.round(settings.voice_volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.voice_volume}
                onChange={(e) => handleChange('voice_volume', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Voice Pitch</span>
                <span className="text-primary-400">{settings.voice_pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={settings.voice_pitch}
                onChange={(e) => handleChange('voice_pitch', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-4">Display Settings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Theme</span>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Auto-scroll Debate Feed</span>
              <ToggleSwitch enabled={settings.auto_scroll} onChange={(val) => handleChange('auto_scroll', val)} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Real-time Updates</span>
              <ToggleSwitch enabled={settings.realtime_updates} onChange={(val) => handleChange('realtime_updates', val)} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Notifications</span>
              <ToggleSwitch enabled={settings.notifications_enabled} onChange={(val) => handleChange('notifications_enabled', val)} />
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="stat-card lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-3">API Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-sm">Backend URL</label>
              <input
                type="text"
                value={settings.api_url}
                onChange={(e) => handleChange('api_url', e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2 text-xs text-success">
              <i className="bi bi-check-circle-fill"></i>
              <span>Connected to API Server</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="lg:col-span-2">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="btn-primary w-full md:w-auto disabled:opacity-50"
          >
            {loading ? (
              <><i className="bi bi-hourglass-split animate-spin mr-2"></i>Saving...</>
            ) : (
              <><i className="bi bi-check-lg mr-2"></i>Save Settings</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;