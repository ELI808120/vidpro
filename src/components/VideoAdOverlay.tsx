import React, { useState, useEffect } from 'react';

const VideoAdOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center rounded-xl overflow-hidden">
      <div className="text-center">
        <p className="text-yellow-400 text-sm font-bold mb-2">הסרטון יתחיל בעוד...</p>
        <div className="text-7xl font-black text-white mb-8">{timeLeft}</div>
        <button 
          onClick={() => timeLeft === 0 && onComplete()}
          className={`px-10 py-3 rounded-full font-black transition-all ${timeLeft > 0 ? 'bg-white/10 text-white/20' : 'bg-yellow-400 text-black shadow-lg'}`}
        >
          {timeLeft > 0 ? 'דלג בקרוב' : 'דלג על הפרסומת'}
        </button>
      </div>
    </div>
  );
};
export default VideoAdOverlay;