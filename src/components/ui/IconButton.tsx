import React from 'react';
import { cn } from '../../utilities';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'active' | 'ghost' | 'lime' | 'coral';
  size?: 'xs' | 'sm' | 'md';
  active?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'default', size = 'sm', active = false, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-all duration-150 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed select-none rounded-xs';

    const sizes = {
      xs: 'w-7 h-7 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
    };

    const variants = {
      default:
        'bg-obsidian-surface border border-obsidian-border text-obsidian-text hover:text-white hover:border-obsidian-border-hover hover:bg-obsidian-subtle',
      active:
        'bg-obsidian-subtle border border-acid-lime text-acid-lime shadow-active-lime',
      ghost:
        'text-obsidian-text hover:text-white hover:bg-obsidian-subtle',
      lime:
        'bg-acid-lime text-black hover:bg-white',
      coral:
        'bg-signal-coral text-white hover:bg-signal-coral-hover',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizes[size],
          active ? variants.active : variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

