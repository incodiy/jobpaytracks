
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LicenseExpiryNotificationProps {
  daysRemaining: number;
  isVisible: boolean;
  onClose: () => void;
}

const LicenseExpiryNotification: React.FC<LicenseExpiryNotificationProps> = ({
  daysRemaining,
  isVisible,
  onClose,
}) => {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('license_notification_position');
    return saved ? JSON.parse(saved) : { x: 20, y: 80 };
  });

  useEffect(() => {
    localStorage.setItem('license_notification_position', JSON.stringify(position));
  }, [position]);

  if (!isVisible) return null;

  const formatTimeRemaining = (days: number): string => {
    if (days <= 0) return 'Sudah berakhir';
    if (days === 1) return '1 hari lagi';
    if (days < 30) return `${days} hari lagi`;
    
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    
    if (months === 1 && remainingDays === 0) return '1 bulan lagi';
    if (remainingDays === 0) return `${months} bulan lagi`;
    return `${months} bulan ${remainingDays} hari lagi`;
  };

  const getNotificationColor = (days: number) => {
    if (days <= 7) return 'red';
    if (days <= 30) return 'orange';
    return 'yellow';
  };

  const color = getNotificationColor(daysRemaining);

  return (
    <Card
      className={`fixed z-40 shadow-lg border-2 bg-${color}-50 border-${color}-300`}
      style={{
        left: position.x,
        top: position.y,
        width: 'auto',
        minWidth: '320px',
        maxWidth: '400px',
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full bg-${color}-100 flex-shrink-0`}>
              <AlertTriangle className={`h-5 w-5 text-${color}-600`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold text-${color}-800 mb-1`}>
                Lisensi Akan Berakhir
              </h4>
              <p className={`text-sm text-${color}-700 mb-2`}>
                Lisensi Anda akan berakhir dalam{' '}
                <span className="font-bold">{formatTimeRemaining(daysRemaining)}</span>
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Clock className="h-3 w-3" />
                <span>Segera hubungi administrator untuk perpanjangan</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-100 flex-shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LicenseExpiryNotification;
