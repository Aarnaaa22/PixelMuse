import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Save,
  Download,
  Edit2,
  Check,
  User,
} from 'lucide-react';
import { BrandLogo } from '../common';
import { Button, IconButton, Badge } from '../ui';
import { useStudioStore } from '../../stores';

interface TopToolbarProps {
  onOpenExport: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ onOpenExport }) => {
  const {
    projectName,
    setProjectName,
    undo,
    redo,
    historyPast,
    historyFuture,
    resetAll,
    saveProject,
  } = useStudioStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);
  const [saveToast, setSaveToast] = useState(false);

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;

  const handleSave = () => {
    saveProject();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setProjectName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="h-14 bg-obsidian-950 border-b border-obsidian-border px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Brand Logo & Project Name */}
      <div className="flex items-center gap-5">
        <BrandLogo size="sm" />

        <div className="h-5 w-px bg-obsidian-border" />

        {/* Current Project Name (Editable) */}
        {isEditingName ? (
          <form onSubmit={handleNameSubmit} className="flex items-center gap-1.5">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              autoFocus
              onBlur={() => setIsEditingName(false)}
              className="bg-obsidian-surface border border-acid-lime px-2 py-1 font-mono text-xs text-white focus:outline-none rounded-xs w-48"
            />
            <IconButton size="xs" variant="lime" type="submit">
              <Check className="w-3 h-3 text-black" />
            </IconButton>
          </form>
        ) : (
          <div
            onClick={() => {
              setNameInput(projectName);
              setIsEditingName(true);
            }}
            className="group flex items-center gap-2 cursor-pointer py-1 px-2 rounded-xs hover:bg-obsidian-surface transition-colors"
            title="Click to rename project"
          >
            <span className="font-mono text-xs uppercase text-white font-medium tracking-wide">
              {projectName}
            </span>
            <Edit2 className="w-3 h-3 text-obsidian-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            <Badge variant="outline" size="xs">
              DRAFT
            </Badge>
          </div>
        )}
      </div>

      {/* Center: Undo / Redo / Reset Operations */}
      <div className="flex items-center gap-1.5">
        <IconButton
          size="sm"
          disabled={!canUndo}
          onClick={undo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </IconButton>

        <IconButton
          size="sm"
          disabled={!canRedo}
          onClick={redo}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </IconButton>

        <div className="h-4 w-px bg-obsidian-border mx-1" />

        <IconButton
          size="sm"
          onClick={() => {
            if (confirm('Reset all studio parameters to factory defaults?')) {
              resetAll();
            }
          }}
          title="Reset All Parameters to Default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </IconButton>
      </div>

      {/* Right: Save / Export / User Area */}
      <div className="flex items-center gap-3">
        {/* Save Project Button */}
        <Button
          variant="secondary"
          size="sm"
          icon={saveToast ? <Check className="w-3.5 h-3.5 text-acid-lime" /> : <Save className="w-3.5 h-3.5" />}
          onClick={handleSave}
          title="Save project state to local storage"
        >
          {saveToast ? 'Saved' : 'Save'}
        </Button>

        {/* Primary Export Master Trigger */}
        <Button
          variant="primary"
          size="sm"
          icon={<Download className="w-3.5 h-3.5 text-black" />}
          onClick={onOpenExport}
        >
          Export
        </Button>

        <div className="h-5 w-px bg-obsidian-border" />

        {/* User / Profile Area */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
          <div className="w-7 h-7 rounded-xs bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-obsidian-muted group-hover:border-acid-lime transition-colors">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-mono text-2xs uppercase text-white font-medium leading-none">
              STUDIO PRO
            </span>
            <span className="font-mono text-[9px] text-obsidian-muted uppercase mt-0.5 leading-none">
              ARCHIVE ACTIVE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
