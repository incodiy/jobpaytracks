
import React from 'react';
import DemoBlurOverlay from './DemoBlurOverlay';
import { useLicense } from '@/hooks/useLicense';

interface ProtectedViewProps {
  children: React.ReactNode;
  className?: string;
  onActivateLicense?: () => void;
}

const ProtectedView: React.FC<ProtectedViewProps> = ({ 
  children, 
  className = "",
  onActivateLicense 
}) => {
  const { isDemoExpired } = useLicense();

  return (
    <div className={`relative ${className}`}>
      {children}
      <DemoBlurOverlay 
        isActive={isDemoExpired} 
        onActivateLicense={onActivateLicense}
      />
    </div>
  );
};

export default ProtectedView;
