import React, { useState } from 'react';
import { PanelLeft, Sliders, X } from 'lucide-react';
import {
  TopToolbar,
  LeftSidebar,
  CanvasStage,
  InspectorPanel,
  TimelineBar,
  ExportModal,
} from '../components/studio';
import { KeyboardShortcutsModal } from '../components/studio/KeyboardShortcutsModal';
import { StatusFooter } from '../components/common';
import { useKeyboardShortcuts } from '../hooks';

export const StudioLayout: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<'none' | 'left' | 'right'>('none');

  // Bind studio keyboard shortcuts
  useKeyboardShortcuts(
    () => setIsExportOpen(true),
    () => setIsShortcutsOpen((prev) => !prev)
  );

  return (
    <div className="flex-1 flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-obsidian-heading">
      {/* 1. TOP TOOLBAR */}
      <TopToolbar
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* 2. MAIN WORKSPACE: LEFT SIDEBAR + CENTER CANVAS + RIGHT INSPECTOR */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Pinned on Desktop (lg+), Modal Drawer on Tablet/Mobile */}
        <div
          className={`
            fixed inset-y-14 left-0 z-40 bg-obsidian-950/95 lg:static lg:flex lg:z-auto transition-transform duration-200
            ${mobileDrawer === 'left' ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 hidden lg:flex'}
          `}
        >
          <div className="relative h-full flex flex-col">
            {/* Mobile Drawer Close Button */}
            <div className="lg:hidden p-2 flex justify-end bg-obsidian-950 border-b border-obsidian-border">
              <button
                onClick={() => setMobileDrawer('none')}
                className="p-1 text-obsidian-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <LeftSidebar />
          </div>
        </div>

        {/* Backdrop for Mobile Left Drawer */}
        {mobileDrawer === 'left' && (
          <div
            onClick={() => setMobileDrawer('none')}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Center Canvas Stage & Bottom Timeline */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Mobile Quick Drawer Toggle Bar (< lg) */}
          <div className="lg:hidden absolute top-2 left-2 right-2 z-30 flex items-center justify-between pointer-events-none">
            <button
              onClick={() => setMobileDrawer((p) => (p === 'left' ? 'none' : 'left'))}
              className="pointer-events-auto px-3 py-1.5 bg-obsidian-950/90 border border-obsidian-border text-white font-mono text-2xs uppercase rounded-xs flex items-center gap-1.5 backdrop-blur-md shadow-lg hover:border-acid-lime"
            >
              <PanelLeft className="w-3.5 h-3.5 text-acid-lime" />
              <span>Presets & Modes</span>
            </button>

            <button
              onClick={() => setMobileDrawer((p) => (p === 'right' ? 'none' : 'right'))}
              className="pointer-events-auto px-3 py-1.5 bg-obsidian-950/90 border border-obsidian-border text-white font-mono text-2xs uppercase rounded-xs flex items-center gap-1.5 backdrop-blur-md shadow-lg hover:border-acid-lime"
            >
              <span>Inspector</span>
              <Sliders className="w-3.5 h-3.5 text-electric-violet-light" />
            </button>
          </div>

          <CanvasStage />
          <TimelineBar />
        </div>

        {/* Right Inspector: Pinned on Desktop (lg+), Modal Drawer on Tablet/Mobile */}
        <div
          className={`
            fixed inset-y-14 right-0 z-40 bg-obsidian-950/95 lg:static lg:flex lg:z-auto transition-transform duration-200
            ${mobileDrawer === 'right' ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0 hidden lg:flex'}
          `}
        >
          <div className="relative h-full flex flex-col">
            {/* Mobile Drawer Close Button */}
            <div className="lg:hidden p-2 flex justify-start bg-obsidian-950 border-b border-obsidian-border">
              <button
                onClick={() => setMobileDrawer('none')}
                className="p-1 text-obsidian-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <InspectorPanel />
          </div>
        </div>

        {/* Backdrop for Mobile Right Drawer */}
        {mobileDrawer === 'right' && (
          <div
            onClick={() => setMobileDrawer('none')}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden backdrop-blur-xs"
          />
        )}
      </div>

      {/* 3. ENGINE DIAGNOSTICS STATUS FOOTER */}
      <StatusFooter />

      {/* 4. MODALS */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
