import React from 'react';
import { cn } from '../../utilities';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'coral' | 'violet';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'sm',
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed select-none';

    const variants = {
      // Acid lime high-impact action
      primary:
        'bg-acid-lime text-black font-semibold hover:bg-white active:scale-[0.98] shadow-sm',
      // Obsidian subtle border
      secondary:
        'bg-obsidian-subtle text-obsidian-heading border border-obsidian-border hover:border-obsidian-border-hover hover:bg-obsidian-border/30 active:scale-[0.98]',
      outline:
        'border border-obsidian-border text-obsidian-text hover:text-white hover:border-obsidian-muted active:scale-[0.98]',
      ghost:
        'text-obsidian-text hover:text-white hover:bg-obsidian-subtle active:scale-[0.98]',
      coral:
        'bg-signal-coral text-white font-semibold hover:bg-signal-coral-hover active:scale-[0.98]',
      violet:
        'bg-electric-violet text-white font-semibold hover:bg-electric-violet-light active:scale-[0.98]',
    };

    const sizes = {
      xs: 'h-7 px-2.5 text-2xs gap-1.5 rounded-xs',
      sm: 'h-8 px-3 text-xs gap-2 rounded-xs',
      md: 'h-10 px-4 text-xs gap-2 rounded-sm',
      lg: 'h-12 px-6 text-sm gap-2.5 rounded-sm',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

