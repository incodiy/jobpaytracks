
import { useState, useEffect } from 'react';
import { LicenseConfig } from '@/types/license-config';

const DEFAULT_CONFIG: LicenseConfig = {
  demoDuration: 3600, // 1 hour default
  enableDemo: true,
  adminLicenseKey: 'DEV-LIFETIME-2025-MAIN-DEVELOPER',
  maxDemoSessions: 5,
  demoRestrictedFeatures: [],
  lastUpdated: new Date().toISOString(),
};

const CONFIG_STORAGE_KEY = 'license_config';

export const useLicenseConfig = () => {
  const [config, setConfig] = useState<LicenseConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Load config from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        const parsedConfig = JSON.parse(stored);
        setConfig({ ...DEFAULT_CONFIG, ...parsedConfig });
      } catch (error) {
        console.error('Error loading license config:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateConfig = (updates: Partial<LicenseConfig>) => {
    const newConfig = {
      ...config,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    
    setConfig(newConfig);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
  };

  const resetToDefaults = () => {
    const defaultConfig = {
      ...DEFAULT_CONFIG,
      lastUpdated: new Date().toISOString(),
    };
    
    setConfig(defaultConfig);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(defaultConfig));
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} jam ${minutes > 0 ? minutes + ' menit' : ''}`;
    }
    return `${minutes} menit`;
  };

  return {
    config,
    isLoading,
    updateConfig,
    resetToDefaults,
    formatDuration,
  };
};
