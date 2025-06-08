import { useState, useEffect, useCallback } from 'react';
import { DemoCountdown } from '@/types/license';
import { useLicenseConfig } from './useLicenseConfig';

const DEMO_STORAGE_KEY = 'demo_countdown';

export const useDemoCountdown = () => {
  const { config } = useLicenseConfig();
  const DEMO_DURATION = config.demoDuration; // Get from config

  const [countdown, setCountdown] = useState<DemoCountdown>({
    isActive: false,
    timeLeft: DEMO_DURATION,
    startTime: 0,
    duration: DEMO_DURATION,
  });

  const [isExpired, setIsExpired] = useState(false);

  // Load demo state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        const elapsed = (now - parsed.startTime) / 1000;
        const timeLeft = Math.max(0, DEMO_DURATION - elapsed);
        
        if (timeLeft > 0) {
          setCountdown({
            isActive: true,
            timeLeft,
            startTime: parsed.startTime,
            duration: DEMO_DURATION,
          });
        } else {
          setIsExpired(true);
          setCountdown(prev => ({ ...prev, timeLeft: 0, isActive: false }));
        }
      } catch (error) {
        console.error('Error parsing demo countdown:', error);
      }
    }
  }, [DEMO_DURATION]);

  // Update countdown duration when config changes
  useEffect(() => {
    setCountdown(prev => ({
      ...prev,
      duration: DEMO_DURATION,
      timeLeft: prev.isActive ? prev.timeLeft : DEMO_DURATION,
    }));
  }, [DEMO_DURATION]);

  // Start demo countdown
  const startDemo = useCallback(() => {
    const startTime = Date.now();
    const newCountdown = {
      isActive: true,
      timeLeft: DEMO_DURATION,
      startTime,
      duration: DEMO_DURATION,
    };

    setCountdown(newCountdown);
    setIsExpired(false);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ startTime }));
  }, [DEMO_DURATION]);

  // Stop demo countdown
  const stopDemo = useCallback(() => {
    setCountdown({
      isActive: false,
      timeLeft: DEMO_DURATION,
      startTime: 0,
      duration: DEMO_DURATION,
    });
    setIsExpired(false);
    localStorage.removeItem(DEMO_STORAGE_KEY);
  }, [DEMO_DURATION]);

  // Reset demo (for testing)
  const resetDemo = useCallback(() => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    stopDemo();
  }, [stopDemo]);

  // Update countdown every second
  useEffect(() => {
    if (!countdown.isActive || countdown.timeLeft <= 0) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        const now = Date.now();
        const elapsed = (now - prev.startTime) / 1000;
        const timeLeft = Math.max(0, DEMO_DURATION - elapsed);

        if (timeLeft <= 0) {
          setIsExpired(true);
          localStorage.removeItem(DEMO_STORAGE_KEY);
          return { ...prev, timeLeft: 0, isActive: false };
        }

        return { ...prev, timeLeft };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown.isActive, countdown.startTime, DEMO_DURATION]);

  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    countdown,
    isExpired,
    startDemo,
    stopDemo,
    resetDemo,
    formatTime,
  };
};
