
import React, { useState, useEffect, useCallback } from 'react';
import { SLIDES } from './constants';
import { SlideRenderer } from './components/SlideRenderer';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';

const App: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = useCallback(() => {
    if (currentIdx < SLIDES.length - 1) {
      setDirection(1);
      setCurrentIdx(prev => prev + 1);
    }
  }, [currentIdx]);

  const prevSlide = useCallback(() => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(prev => prev - 1);
    }
  }, [currentIdx]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const progress = ((currentIdx + 1) / SLIDES.length) * 100;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden relative selection:bg-red-200 font-inter">
      {/* Background Decor */}
      {!isFullscreen && (
        <>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 maroon-bg opacity-[0.02] rounded-bl-full pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 maroon-bg opacity-[0.03] rounded-tr-full pointer-events-none z-0" />
        </>
      )}

      {/* Main Slide Content Area */}
      <main className={`flex-grow flex items-center justify-center p-4 lg:p-10 z-10 ${isFullscreen ? 'p-0' : ''}`}>
        <div className={`w-full h-full relative overflow-hidden bg-white shadow-2xl transition-all duration-500 ease-in-out ${isFullscreen ? 'max-w-none max-h-none' : 'max-w-7xl max-h-[85vh] rounded-2xl border border-gray-100'}`}>
          <SlideRenderer slide={SLIDES[currentIdx]} direction={direction} />
        </div>
      </main>

      {/* Persistent Navigation Controls */}
      <footer className={`fixed bottom-0 left-0 right-0 p-4 lg:p-6 flex items-center justify-between pointer-events-none z-20 transition-all duration-300 ${isFullscreen ? 'opacity-0 hover:opacity-100 bg-black/5' : 'opacity-100'}`}>
        <div className="flex items-center space-x-3 pointer-events-auto">
          <button 
            onClick={prevSlide}
            disabled={currentIdx === 0}
            className={`p-2 lg:p-3 rounded-full transition-all border ${currentIdx === 0 ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 bg-white/80 backdrop-blur-sm hover:maroon-bg hover:text-white hover:border-transparent active:scale-90 shadow-sm'}`}
            title="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentIdx === SLIDES.length - 1}
            className={`p-2 lg:p-3 rounded-full transition-all border ${currentIdx === SLIDES.length - 1 ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 bg-white/80 backdrop-blur-sm hover:maroon-bg hover:text-white hover:border-transparent active:scale-90 shadow-sm'}`}
            title="Next Slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-6 pointer-events-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold maroon-text uppercase tracking-widest leading-none mb-1">Slide</span>
            <span className="text-lg lg:text-xl font-black text-gray-800 leading-none">{currentIdx + 1} <span className="text-gray-300 font-medium">/</span> {SLIDES.length}</span>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-maroon-bg transition-all hover:scale-110"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </footer>

      {/* Progress Bar (Hidden in Fullscreen for cleaner look, or kept minimal) */}
      <div className={`absolute bottom-0 left-0 w-full h-1 lg:h-1.5 bg-gray-100/50 transition-opacity duration-300 ${isFullscreen ? 'opacity-0' : 'opacity-100'}`}>
        <div 
          className="h-full maroon-bg transition-all duration-700 ease-out shadow-[0_0_10px_rgba(128,0,0,0.2)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default App;
