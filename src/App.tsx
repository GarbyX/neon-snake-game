import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans selection:bg-fuchsia-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
              NEON
            </span>
            <span className="text-white"> ARCADE</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Beats & Bytes</p>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto w-full">
          {/* Left: Music Player */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end order-2 lg:order-1">
            <MusicPlayer />
          </div>

          {/* Right: Game */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-start order-1 lg:order-2">
            <SnakeGame />
          </div>
        </main>
        
        <footer className="mt-12 text-center text-gray-600 font-mono text-xs">
          <p>© {new Date().getFullYear()} Neon Arcade. Play responsibly.</p>
        </footer>
      </div>
    </div>
  );
}
