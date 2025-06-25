// src/components/3-organisms/GameBoard/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array means this effect runs only once on mount

  return windowSize;
}