import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrandLogo, NavigationRail } from '../components/common';
import { NoiseOverlay } from '../components/ui';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-obsidian text-obsidian-heading flex flex-col font-sans selection:bg-electric-violet selection:text-white">
      <NoiseOverlay />

      {/* Global Top Navigation Bar */}
      <header className="h-14 border-b border-obsidian-border bg-obsidian-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <BrandLogo size="md" />
        <NavigationRail />
      </header>

      {/* Primary Outlet */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

