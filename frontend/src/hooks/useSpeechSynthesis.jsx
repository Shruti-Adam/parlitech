import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState([]);
  const [settings, setSettings] = useState({
    rate: 0.85,
    pitch: 1.0,
    volume: 1.0
  });

  useEffect(() => {
    if (!window.speechSynthesis) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (!supported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Select a natural voice
    const preferredVoice = voices.find(v => 
      v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [supported, voices, settings]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return { speak, stop, speaking, supported, updateSettings, settings };
};