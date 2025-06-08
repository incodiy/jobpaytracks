
import React, { useState, useRef, useEffect } from 'react';
import { Clock, X, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DraggableDemoTimerProps {
  timeLeft: number;
  isVisible: boolean;
  onClose?: () => void;
  onExpired?: () => void;
  isDismissible?: boolean;
}

const DraggableDemoTimer: React.FC<DraggableDemoTimerProps> = ({
  timeLeft,
  isVisible,
  onClose,
  onExpired,
  isDismissible = false,
}) => {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('demo_timer_position');
    return saved ? JSON.parse(saved) : { x: 20, y: 20 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement>(null);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('demo_timer_position', JSON.stringify(position));
  }, [position]);

  // Handle expiration
  useEffect(() => {
    if (timeLeft <= 0 && onExpired) {
      onExpired();
    }
  }, [timeLeft, onExpired]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timerRef.current) return;
    
    const rect = timerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Boundary checks
    const maxX = window.innerWidth - 300;
    const maxY = window.innerHeight - 100;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  const isExpired = timeLeft <= 0;
  const isWarning = timeLeft <= 300; // 5 minutes warning

  return (
    <Card
      ref={timerRef}
      className={`fixed z-50 cursor-move select-none shadow-lg border-2 transition-all duration-200 ${
        isExpired 
          ? 'bg-red-50 border-red-300' 
          : isWarning 
          ? 'bg-orange-50 border-orange-300' 
          : 'bg-blue-50 border-blue-300'
      } ${isDragging ? 'shadow-2xl scale-105' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: 'auto',
        minWidth: '280px',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-3">
        <div className="flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded-full ${
              isExpired 
                ? 'bg-red-100' 
                : isWarning 
                ? 'bg-orange-100' 
                : 'bg-blue-100'
            }`}>
              <Clock className={`h-4 w-4 ${
                isExpired 
                  ? 'text-red-600' 
                  : isWarning 
                  ? 'text-orange-600' 
                  : 'text-blue-600'
              }`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${
                isExpired 
                  ? 'text-red-800' 
                  : isWarning 
                  ? 'text-orange-800' 
                  : 'text-blue-800'
              }`}>
                {isExpired ? 'Demo Berakhir' : 'Waktu Demo'}
              </p>
              <p className={`text-lg font-bold ${
                isExpired 
                  ? 'text-red-900' 
                  : isWarning 
                  ? 'text-orange-900' 
                  : 'text-blue-900'
              }`}>
                {isExpired ? '00:00' : formatTime(timeLeft)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="text-gray-400 cursor-move p-1">
              <Move className="h-4 w-4" />
            </div>
            {isDismissible && onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        {isExpired && (
          <p className="text-xs text-red-700 mt-1">
            Silakan aktivasi lisensi untuk melanjutkan
          </p>
        )}
      </div>
    </Card>
  );
};

export default DraggableDemoTimer;
