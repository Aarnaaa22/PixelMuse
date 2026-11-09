import React from 'react';
import { cn } from '../../utilities';

interface SiteFooterProps {
  className?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'border-t border-obsidian-border bg-obsidian-950 px-6 py-10 w-full mt-auto',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="font-display text-xs tracking-[0.25em] font-extrabold uppercase text-white">
            PIXELMUSE
          </span>
          <span className="hidden sm:inline text-obsidian-border">/</span>
          <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
            Experimental Digital Art Studio & Generative Laboratory
          </span>
        </div>

        <div className="flex items-center gap-3 bg-obsidian-900/90 border border-obsidian-border px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(255,20,147,0.2)]">
          <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
            CREDITS:
          </span>
          <span className="font-mono text-sm sm:text-base font-black tracking-wider text-[#FF1493] drop-shadow-[0_0_14px_rgba(255,20,147,0.95)]">
            ★ Aarna Chopdekar
          </span>
        </div>
      </div>
    </footer>
  );
};

