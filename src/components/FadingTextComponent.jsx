'use client'; 

import { useState, useEffect } from 'react';

const FadingTextComponent = ({ texts, interval = 4500, fadeDuration = 500 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    const cycleTexts = () => {
      // Start fading out
      setFadeState('fade-out');

      // After fade-out completes, change text and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setFadeState('fade-in');
      }, fadeDuration);
    };

    const intervalId = setInterval(cycleTexts, interval);

    return () => clearInterval(intervalId);
  }, [texts.length, interval, fadeDuration]);

  // Calculate Tailwind classes based on fade state
  const getFadeClasses = () => {
    switch (fadeState) {
      case 'fade-in':
        return 'opacity-100 transition-opacity duration-500';
      case 'fade-out':
        return 'opacity-0 transition-opacity duration-500';
      default:
        return 'opacity-0';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[4rem] ">
      <span className={`text-lg md:text-xl font-medium text-gray-400 ${getFadeClasses()}`}>
        {texts[currentIndex]}
      </span>
    </div>
  );
};

export default FadingTextComponent;