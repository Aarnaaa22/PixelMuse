import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BrandLogo, NavigationRail } from '../components/common';
import { NoiseOverlay } from '../components/ui';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const isStudio = location.pathname.startsWith('/studio');

  return (
    <div className="min-h-screen bg-obsidian text-obsidian-heading flex flex-col font-sans selection:bg-electric-violet selection:text-white overflow-hidden">
      <NoiseOverlay />

      {/* Global Top Navigation Bar (Hidden when inside Studio Workspace) */}
      {!isStudio && (
        <header className="h-14 border-b border-obsidian-border bg-obsidian-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <BrandLogo size="md" />
          <NavigationRail />
        </header>
      )}

      {/* Primary Content Outlet */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
