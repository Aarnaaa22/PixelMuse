import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utilities';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, size = 'md' }) => {
  return (
    <Link
      to="/"
      className={cn(
        'group flex items-center gap-2.5 select-none focus:outline-none',
        className
      )}
    >
      {/* Precision Geometric Art Mark */}
      <div className="relative w-7 h-7 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center overflow-hidden transition-colors group-hover:border-acid-lime">
        <div className="w-2.5 h-2.5 bg-acid-lime transition-transform group-hover:scale-125" />
        <div className="absolute top-0 right-0 w-1 h-1 bg-signal-coral" />
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-electric-violet" />
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            'font-display tracking-[0.25em] font-extrabold uppercase leading-none transition-colors group-hover:text-acid-lime',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-xl' : 'text-sm'
          )}
        >
          PIXELMUSE
        </span>
        <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted mt-0.5">
          Art Studio
        </span>
      </div>
    </Link>
  );
};

