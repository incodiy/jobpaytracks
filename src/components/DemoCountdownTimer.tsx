
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
import { useDemoCountdown } from '@/hooks/useDemoCountdown';

interface DemoCountdownTimerProps {
  isVisible: boolean;
  timeLeft: number;
  onExpired?: () => void;
}

const DemoCountdownTimer: React.FC<DemoCountdownTimerProps> = ({ 
  isVisible, 
  timeLeft,
  onExpired 
}) => {
  const { formatTime } = useDemoCountdown();

  if (!isVisible) return null;

  const isWarning = timeLeft <= 300; // 5 minutes warning
  const isCritical = timeLeft <= 60; // 1 minute critical

  React.useEffect(() => {
    if (timeLeft <= 0 && onExpired) {
      onExpired();
    }
  }, [timeLeft, onExpired]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
      <Card className={`shadow-lg border-2 ${
        isCritical ? 'border-red-500 bg-red-50' : 
        isWarning ? 'border-orange-500 bg-orange-50' : 
        'border-blue-500 bg-blue-50'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            {isCritical ? (
              <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
            ) : (
              <Clock className="h-4 w-4 text-blue-600" />
            )}
            
            <Badge 
              variant={isCritical ? "destructive" : isWarning ? "secondary" : "default"}
              className="font-mono"
            >
              {formatTime(timeLeft)}
            </Badge>
            
            <span className={`text-sm font-medium ${
              isCritical ? 'text-red-700' : 
              isWarning ? 'text-orange-700' : 
              'text-blue-700'
            }`}>
              Demo Time
            </span>
          </div>
          
          {isWarning && (
            <p className="text-xs text-gray-600 mt-1">
              {isCritical ? 'Demo akan berakhir!' : 'Demo akan berakhir segera'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoCountdownTimer;
