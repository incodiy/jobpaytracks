
import React, { createContext, useContext, useState } from 'react';
import { EncryptionConfig } from '@/types/license';

interface EncryptionContextType {
  config: EncryptionConfig;
  updateConfig: (config: EncryptionConfig) => void;
  encryptData: (data: string) => string;
  decryptData: (encryptedData: string) => string;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};

interface EncryptionProviderProps {
  children: React.ReactNode;
}

export const EncryptionProvider: React.FC<EncryptionProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<EncryptionConfig>({
    enabled: false,
    algorithm: 'AES',
  });

  // Simple encryption untuk demo (production harus gunakan library proper)
  const encryptData = (data: string): string => {
    if (!config.enabled) return data;
    
    // Simulasi enkripsi sederhana (jangan gunakan di production!)
    return btoa(data);
  };

  const decryptData = (encryptedData: string): string => {
    if (!config.enabled) return encryptedData;
    
    try {
      return atob(encryptedData);
    } catch {
      return encryptedData;
    }
  };

  const updateConfig = (newConfig: EncryptionConfig) => {
    setConfig(newConfig);
    localStorage.setItem('encryption_config', JSON.stringify(newConfig));
  };

  return (
    <EncryptionContext.Provider value={{
      config,
      updateConfig,
      encryptData,
      decryptData,
    }}>
      {children}
    </EncryptionContext.Provider>
  );
};
