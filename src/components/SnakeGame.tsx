import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [dir, setDir] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const dirRef = useRef(dir);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDir({ x: 0, y: -1 });
    dirRef.current = { x: 0, y: -1 };
    setGameOver(false);
    setScore(0);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!hasStarted && e.key === ' ') {
        resetGame();
        return;
      }

      if (gameOver && e.key === ' ') {
        resetGame();
        return;
      }

      const currentDir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y !== 1) setDir({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y !== -1) setDir({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x !== 1) setDir({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x !== -1) setDir({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    if (!hasStarted || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10));
    return () => clearInterval(intervalId);
  }, [hasStarted, gameOver, food, score]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-950/80 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-sm">
      <div className="flex justify-between items-center w-full mb-6 px-2">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider uppercase">
          Neon Snake
        </h2>
        <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full border border-fuchsia-500/30 shadow-[0_0_10px_rgba(255,0,255,0.2)]">
          <Trophy className="w-5 h-5 text-fuchsia-400" />
          <span className="text-xl font-mono text-fuchsia-400 font-bold">{score}</span>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.2)] rounded-lg overflow-hidden"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {hasStarted && !gameOver && snake.map((segment, index) => (
          <div
            key={index}
            className="absolute rounded-sm"
            style={{
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              width: '20px',
              height: '20px',
              backgroundColor: index === 0 ? '#00ffff' : '#00b3b3',
              boxShadow: index === 0 ? '0 0 10px #00ffff' : 'none',
              zIndex: 10,
            }}
          />
        ))}

        {hasStarted && !gameOver && (
          <div
            className="absolute rounded-full"
            style={{
              left: `${food.x * 20}px`,
              top: `${food.y * 20}px`,
              width: '20px',
              height: '20px',
              backgroundColor: '#ff00ff',
              boxShadow: '0 0 15px #ff00ff, 0 0 5px #ff00ff',
              zIndex: 5,
            }}
          />
        )}

        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            {gameOver ? (
              <>
                <h3 className="text-4xl font-black text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] uppercase tracking-widest">Game Over</h3>
                <p className="text-cyan-400 font-mono mb-6 text-lg">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                  <Play className="w-8 h-8 text-cyan-400 ml-1" />
                </div>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] active:scale-95 uppercase tracking-wider"
                >
                  Start Game
                </button>
                <p className="mt-4 text-gray-400 text-sm font-mono">Use Arrow Keys or WASD</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
