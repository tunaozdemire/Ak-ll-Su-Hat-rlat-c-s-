import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Theme } from '../../styles/theme';
import { playAppSound } from '../../services/notificationService';
import { AppSound } from '../../types';

interface MetricsFormProps {
  weight: number;
  height: number;
  onWeightChange: (weight: number) => void;
  onHeightChange: (height: number) => void;
  theme: Theme;
}

export const MetricsForm: React.FC<MetricsFormProps> = ({ weight, height, onWeightChange, onHeightChange, theme }) => {
  const [activeMetric, setActiveMetric] = useState<'weight' | 'height'>('weight');
  const sliderRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const metricConfig = {
    weight: { min: 30, max: 150, value: weight, unit: 'kg', label: 'Ağırlık', onChange: onWeightChange },
    height: { min: 130, max: 220, value: height, unit: 'cm', label: 'Boy', onChange: onHeightChange },
  };

  const { min, max, value, unit, onChange } = metricConfig[activeMetric];

  const handleValueUpdate = useCallback((clientX: number, clientY: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
    if (angle < 0) {
      angle += 360;
    }
    
    // Prevent jump when crossing the 0/360 point
    const currentValuePercent = (value - min) / (max - min);
    const currentAngle = currentValuePercent * 360;
    if (Math.abs(angle - currentAngle) > 180) return;


    const range = max - min;
    const newValue = Math.round((angle / 360) * range) + min;

    onChange(Math.max(min, Math.min(max, newValue)));
  }, [min, max, onChange, value]);
  
  useEffect(() => {
    const endDrag = () => { isDragging.current = false; };
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging.current) {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        handleValueUpdate(clientX, clientY);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }, [handleValueUpdate]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    // Allow initial click to set value
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    handleValueUpdate(clientX, clientY);
  };

  const size = 280;
  const strokeWidth = 30;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((value - min) / (max - min));
  const offset = circumference - progress * circumference;

  const angle = progress * 360;
  const angleInRadians = (angle - 90) * (Math.PI / 180);
  const handleX = center + radius * Math.cos(angleInRadians);
  const handleY = center + radius * Math.sin(angleInRadians);

  return (
    <div className="w-full flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Vücut Bilgilerin</h1>
      <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">Günlük su ihtiyacını daha doğru hesaplamak için bu bilgilere ihtiyacımız var.</p>

      <div className="flex p-1 rounded-full bg-black/5 dark:bg-white/5 mb-8">
        {(Object.keys(metricConfig) as Array<keyof typeof metricConfig>).map((key) => (
          <button
            key={key}
            onClick={() => {
                setActiveMetric(key);
                playAppSound(AppSound.Tap);
            }}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out
              ${activeMetric === key ? `${theme.background} text-white dark:text-zinc-900 shadow-md ${theme.shadow}` : 'text-zinc-600 dark:text-zinc-400'}`}
          >
            {metricConfig[key].label}
          </button>
        ))}
      </div>

      <div className="relative cursor-pointer" onMouseDown={startDrag} onTouchStart={startDrag}>
        <svg ref={sliderRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle cx={center} cy={center} r={radius} strokeWidth={strokeWidth} className="stroke-current text-black/10 dark:text-white/10" fill="none" />
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={theme.color}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
          />
        </svg>
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
            style={{transform: `translate(-50%, -50%) translate(${handleX - center}px, ${handleY - center}px) rotate(${angle}deg)`}}
        >
             <div className="w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-200 dark:bg-zinc-700 dark:border-zinc-500" style={{ transform: 'rotate(90deg)' }} />
        </div>


        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
          <span className="text-6xl font-bold text-zinc-900 dark:text-white">{value}</span>
          <span className="text-xl font-medium text-zinc-500 dark:text-gray-400">{unit}</span>
        </div>
      </div>
    </div>
  );
};