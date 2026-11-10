import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sliders, Compass, PlayCircle, Library, Home, Sparkles } from 'lucide-react';
import { cn } from '../../utilities';

interface NavItem {
  to: string;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Index', icon: <Home className="w-4 h-4" /> },
  { to: '/studio', label: 'Studio', badge: 'v1.0', icon: <Sliders className="w-4 h-4" /> },
  { to: '/library', label: 'Art Library', badge: '48', icon: <Sparkles className="w-4 h-4" /> },
  { to: '/explore', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
  { to: '/motion', label: 'Motion', badge: 'Live', icon: <PlayCircle className="w-4 h-4" /> },
  { to: '/creations', label: 'Creations', icon: <Library className="w-4 h-4" /> },
];

interface NavigationRailProps {
  className?: string;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({ className }) => {
  return (
    <nav className={cn('flex items-center gap-1', className)}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'relative flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wider transition-colors uppercase rounded-xs border',
              isActive
                ? 'bg-obsidian-subtle border-obsidian-border-hover text-white shadow-crisp-border'
                : 'border-transparent text-obsidian-muted hover:text-white hover:bg-obsidian-subtle/50'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className={cn('shrink-0 transition-colors', isActive ? 'text-acid-lime' : '')}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'text-2xs font-mono px-1 py-0.2 rounded-xs border uppercase',
                    isActive
                      ? 'border-acid-lime/40 text-acid-lime bg-acid-lime/10'
                      : 'border-obsidian-border text-obsidian-muted'
                  )}
                >
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute -bottom-[9px] left-3 right-3 h-[2px] bg-acid-lime shadow-active-lime" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
