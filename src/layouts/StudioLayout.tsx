import React, { useState } from 'react';
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
        {/* Left Sidebar Navigation */}
        <LeftSidebar />

        {/* Center Canvas Stage & Bottom Timeline */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <CanvasStage />
          <TimelineBar />
        </div>

        {/* Right Inspector Panel */}
        <InspectorPanel />
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
