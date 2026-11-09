import React from 'react';
import { cn } from '../../utilities';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
  accentColor?: 'lime' | 'violet' | 'coral';
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className,
  accentColor = 'lime',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const accentStyles = {
    lime: 'accent-acid-lime',
    violet: 'accent-electric-violet',
    coral: 'accent-signal-coral',
  };

  return (
    <div className={cn('space-y-1.5 font-mono text-2xs', className)}>
      <div className="flex items-center justify-between text-obsidian-text">
        <span className="uppercase tracking-widest">{label}</span>
        <span className="text-obsidian-heading font-semibold">
          {typeof value === 'number' && Number.isInteger(value) ? value : value.toFixed(1)}
          {unit}
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={cn(
            'w-full h-1 bg-obsidian-border rounded-none appearance-none cursor-pointer focus:outline-none',
            accentStyles[accentColor]
          )}
          style={{
            background: `linear-gradient(to right, #CCFF00 ${percentage}%, #1F1F28 ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
};

