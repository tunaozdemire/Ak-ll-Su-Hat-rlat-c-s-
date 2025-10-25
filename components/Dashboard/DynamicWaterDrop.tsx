import React, { useRef, useState, useEffect } from 'react';

interface DynamicWaterDropProps {
  progress: number;
}

// Helper to interpolate between two values
const interpolate = (start: number, end: number, factor: number) => start + factor * (end - start);

// Helper to interpolate between two colors
const interpolateColor = (color1: [number, number, number], color2: [number, number, number], factor: number) => {
  const result = color1.slice() as [number, number, number];
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
};

// Colors for the gradient - from darker to brighter as progress increases
const START_COLOR: [number, number, number] = [37, 99, 235]; // blue-600
const END_COLOR: [number, number, number] = [96, 165, 250]; // blue-400

interface Bubble {
  id: number;
  cx: number;
  cy: number;
  r: number;
  duration: number;
  delay: number;
}

export const DynamicWaterDrop: React.FC<DynamicWaterDropProps> = ({ progress }) => {
  const size = 250;
  const fillPercentage = Math.max(0, Math.min(100, progress));
  
  const waterLevel = 100 * (1 - fillPercentage / 100);
  
  const colorFactor = fillPercentage / 100;
  const fillColor = interpolateColor(START_COLOR, END_COLOR, colorFactor);

  // Dynamic wave amplitude and speed based on progress
  const waveAmplitude = interpolate(1.5, 4, colorFactor); 
  const waveDuration1 = interpolate(7, 4, colorFactor); // gets faster
  const waveDuration2 = interpolate(9, 5, colorFactor); // gets faster

  const wavePath1 = `M -10,${waterLevel} C 30,${waterLevel - waveAmplitude*2} 70,${waterLevel - waveAmplitude*2} 110,${waterLevel} V 105 H -10 Z`;
  const wavePath2 = `M -10,${waterLevel} C 30,${waterLevel + waveAmplitude*2} 70,${waterLevel + waveAmplitude*2} 110,${waterLevel} V 105 H -10 Z`;

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const prevProgressRef = useRef(progress);

  useEffect(() => {
    if (progress > prevProgressRef.current && prevProgressRef.current > 0) {
        const newBubbles = Array.from({ length: 12 }).map(() => ({
            id: Math.random(),
            cx: 20 + Math.random() * 60,
            cy: 105,
            r: 1 + Math.random() * 2.5,
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
        }));
        setBubbles(currentBubbles => [...currentBubbles, ...newBubbles]);

        const maxDuration = Math.max(...newBubbles.map(b => b.duration + b.delay)) * 1000;
        setTimeout(() => {
            setBubbles(currentBubbles => currentBubbles.filter(b => !newBubbles.some(nb => nb.id === b.id)));
        }, maxDuration);
    }
    prevProgressRef.current = progress;
  }, [progress]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <style>{`
        @keyframes rise {
          from {
            transform: translateY(0);
            opacity: 0.8;
          }
          to {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
        .bubble {
          animation-name: rise;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
      `}</style>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <clipPath id="dropClip">
            <path d="M50,0 C25,25 25,60 50,100 C75,60 75,25 50,0 Z" />
          </clipPath>
        </defs>

        <path
          d="M50,0 C25,25 25,60 50,100 C75,60 75,25 50,0 Z"
          className="fill-current text-gray-200/80 dark:text-zinc-800/80"
        />

        <g clipPath="url(#dropClip)">
          <rect
            x="0"
            y={waterLevel}
            width="100"
            height={100 - waterLevel}
            style={{ fill: fillColor, transition: 'y 0.5s ease-out, fill 0.5s ease-out' }}
          />
          <path
            style={{ fill: fillColor, transition: 'fill 0.5s ease-out' }}
            className="opacity-60"
          >
            <animate
              attributeName="d"
              dur={`${waveDuration1}s`}
              repeatCount="indefinite"
              values={`${wavePath1}; ${wavePath2}; ${wavePath1}`}
            />
          </path>
          <path
            style={{ fill: fillColor, transition: 'fill 0.5s ease-out' }}
            className="opacity-30"
          >
             <animate
              attributeName="d"
              dur={`${waveDuration2}s`}
              repeatCount="indefinite"
              values={`${wavePath2}; ${wavePath1}; ${wavePath2}`}
            />
          </path>
          {bubbles.map(bubble => (
            <circle
                key={bubble.id}
                className="bubble"
                cx={bubble.cx}
                cy={bubble.cy}
                r={bubble.r}
                style={{
                    fill: 'rgba(255, 255, 255, 0.5)',
                    animationDuration: `${bubble.duration}s`,
                    animationDelay: `${bubble.delay}s`,
                }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};