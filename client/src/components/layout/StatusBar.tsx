import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  itemCount: number;
}

export default function StatusBar({ itemCount }: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time as HH:MM
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      
      // Format date as DD.MM.YYYY
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      setCurrentDate(`${day}.${month}.${year}`);
    };
    
    // Update immediately and then every minute
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer className="windows-statusbar">
      <div>{itemCount} Öğe</div>
      <div className="flex items-center">
        <span>{currentTime}</span>
        <span className="mx-2">|</span>
        <span>{currentDate}</span>
      </div>
    </footer>
  );
}
