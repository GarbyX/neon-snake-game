import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Drive (AI Gen)', artist: 'SynthMind', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Pulse (AI Gen)', artist: 'NeuralBeats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Horizon (AI Gen)', artist: 'AlgoRhythm', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md p-6 bg-gray-950/80 rounded-2xl border border-fuchsia-500/30 shadow-[0_0_30px_rgba(255,0,255,0.15)] backdrop-blur-sm">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-fuchsia-600 to-cyan-600 shadow-[0_0_15px_rgba(255,0,255,0.5)] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
          <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
            <Disc3 className="w-8 h-8 text-fuchsia-400" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-lg font-bold text-white truncate">{currentTrack.title}</h3>
          <p className="text-cyan-400 text-sm truncate">{currentTrack.artist}</p>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border border-cyan-500/30">
          <Music className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_10px_rgba(0,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={playPrev}
          className="p-3 text-gray-400 hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full transition-all hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] active:scale-95"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        
        <button 
          onClick={playNext}
          className="p-3 text-gray-400 hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <Volume2 className="w-5 h-5 text-gray-400" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
        />
      </div>

      {/* Playlist */}
      <div className="mt-8 space-y-2">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Up Next</h4>
        {TRACKS.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
              index === currentTrackIndex 
                ? 'bg-fuchsia-500/10 border border-fuchsia-500/30' 
                : 'hover:bg-gray-800/50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className={`text-sm font-mono ${index === currentTrackIndex ? 'text-fuchsia-400' : 'text-gray-600'}`}>
                0{index + 1}
              </span>
              <div className="truncate">
                <p className={`text-sm font-medium truncate ${index === currentTrackIndex ? 'text-white' : 'text-gray-300'}`}>
                  {track.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{track.artist}</p>
              </div>
            </div>
            {index === currentTrackIndex && isPlaying && (
              <div className="flex items-end gap-1 h-4">
                <div className="w-1 bg-fuchsia-500 animate-[bounce_1s_infinite_0ms] h-full" />
                <div className="w-1 bg-fuchsia-500 animate-[bounce_1s_infinite_200ms] h-2/3" />
                <div className="w-1 bg-fuchsia-500 animate-[bounce_1s_infinite_400ms] h-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
