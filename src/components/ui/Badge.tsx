import React from 'react';
import { cn } from '../../utilities';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'lime' | 'violet' | 'coral' | 'outline';
  size?: 'xs' | 'sm';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'xs',
  dot = false,
  className,
}) => {
  const base =
    'inline-flex items-center gap-1.5 font-mono uppercase tracking-widest rounded-xs border select-none';

  const sizes = {
    xs: 'px-2 py-0.5 text-2xs',
    sm: 'px-2.5 py-1 text-xs',
  };

  const variants = {
    default: 'bg-obsidian-subtle border-obsidian-border text-obsidian-text',
    lime: 'bg-acid-lime/10 border-acid-lime/40 text-acid-lime',
    violet: 'bg-electric-violet/15 border-electric-violet/40 text-electric-violet-light',
    coral: 'bg-signal-coral/15 border-signal-coral/40 text-signal-coral',
    outline: 'bg-transparent border-obsidian-border text-obsidian-text',
  };

  const dots = {
    default: 'bg-obsidian-muted',
    lime: 'bg-acid-lime animate-pulse',
    violet: 'bg-electric-violet',
    coral: 'bg-signal-coral',
    outline: 'bg-obsidian-text',
  };

  return (
    <span className={cn(base, sizes[size], variants[variant], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dots[variant])} />}
      {children}
    </span>
  );
};

