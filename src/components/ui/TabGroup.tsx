import React from 'react';
import { cn } from '../../utilities';

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabGroupProps<T extends string = string> {
  tabs: TabOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
  variant?: 'underline' | 'pill';
}

export function TabGroup<T extends string>({
  tabs,
  activeId,
  onChange,
  className,
  variant = 'underline',
}: TabGroupProps<T>) {
  if (variant === 'pill') {
    return (
      <div className={cn('inline-flex p-1 bg-obsidian-subtle border border-obsidian-border rounded-xs', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-xs',
                isActive
                  ? 'bg-obsidian-surface border border-obsidian-border-hover text-white shadow-sm'
                  : 'text-obsidian-muted hover:text-obsidian-text'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="text-2xs opacity-60">({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex border-b border-obsidian-border space-x-6', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'pb-2.5 flex items-center gap-2 text-xs font-mono uppercase tracking-widest relative transition-colors',
              isActive ? 'text-white' : 'text-obsidian-muted hover:text-obsidian-text'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="text-2xs text-obsidian-muted">[{tab.count}]</span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-acid-lime shadow-active-lime" />
            )}
          </button>
        );
      })}
    </div>
  );
}

