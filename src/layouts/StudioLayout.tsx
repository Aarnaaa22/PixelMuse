import React, { useState } from 'react';
import {
  HeaderBar,
  ModeSelector,
  CanvasStage,
  InspectorPanel,
  TimelineBar,
  ExportModal,
} from '../components/studio';
import { StatusFooter } from '../components/common';

export const StudioLayout: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Studio Header Toolbar */}
      <HeaderBar onOpenExport={() => setIsExportOpen(true)} />

      {/* Mode Selector Strip */}
      <ModeSelector />

      {/* Center Stage & Right Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <CanvasStage />
          <TimelineBar />
        </div>
        <InspectorPanel />
      </div>

      {/* Engine Status Diagnostic Footer */}
      <StatusFooter />

      {/* Export Artwork Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};

