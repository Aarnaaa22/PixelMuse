import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../utilities';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  tooltip?: string;
  description?: string;
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
  tooltip,
  description,
  onChange,
  className,
  accentColor = 'lime',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hintText = tooltip || description;
  const percentage = ((value - min) / (max - min)) * 100;

  const accentStyles = {
    lime: 'accent-acid-lime',
    violet: 'accent-electric-violet',
    coral: 'accent-signal-coral',
  };

  return (
    <div
      className={cn('space-y-1.5 font-mono text-2xs group relative select-none', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={hintText || label}
    >
      <div className="flex items-center justify-between text-obsidian-text">
        <div className="flex items-center gap-1.5">
          <span className="uppercase tracking-widest text-obsidian-heading group-hover:text-acid-lime transition-colors">
            {label}
          </span>
          {hintText && (
            <span
              className="text-obsidian-muted group-hover:text-acid-lime cursor-help transition-colors"
              title={hintText}
            >
              <HelpCircle className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
            </span>
          )}
        </div>
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

      {/* Helpful Direction & Explanation on Hover */}
      {hintText && isHovered && (
        <div className="pt-0.5 text-[9.5px] text-obsidian-muted leading-relaxed font-sans animate-in fade-in duration-150">
          <span className="text-acid-lime font-mono font-bold">▸ </span>
          {hintText}
        </div>
      )}
    </div>
  );
};

