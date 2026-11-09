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
  FolderKanban,
  Cloud,
} from 'lucide-react';
import { BrandLogo } from '../common';
import { Button, IconButton, Badge } from '../ui';
import { useStudioStore, useProjectStore, useAuthStore } from '../../stores';
import { ProjectsModal } from './ProjectsModal';
import { AuthModal } from './AuthModal';

interface TopToolbarProps {
  onOpenExport: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ onOpenExport }) => {
  const {
    config,
    projectName,
    setProjectName,
    undo,
    redo,
    historyPast,
    historyFuture,
    resetAll,
    saveProject,
  } = useStudioStore();

  const {
    saveCurrentProject,
    openProjectsModal,
    isProjectsModalOpen,
    closeProjectsModal,
  } = useProjectStore();

  const { user, isCloudConnected } = useAuthStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);
  const [saveToast, setSaveToast] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;

  const handleSave = async () => {
    saveProject();
    const canvas = document.querySelector('canvas');
    const thumb = canvas ? canvas.toDataURL('image/jpeg', 0.5) : undefined;
    await saveCurrentProject(projectName, config, thumb);
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
    <>
      <header className="h-14 bg-obsidian-950 border-b border-obsidian-border px-4 flex items-center justify-between z-30 select-none">
        {/* Left: Brand Logo & Project Name */}
        <div className="flex items-center gap-4">
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
                className="bg-obsidian-surface border border-acid-lime px-2 py-1 font-mono text-xs text-white focus:outline-none rounded-xs w-36 sm:w-48"
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
              className="group hidden sm:flex items-center gap-2 cursor-pointer py-1 px-2 rounded-xs hover:bg-obsidian-surface transition-colors"
              title="Click to rename project"
            >
              <span className="font-mono text-xs uppercase text-white font-medium tracking-wide truncate max-w-[140px] md:max-w-none">
                {projectName}
              </span>
              <Edit2 className="w-3 h-3 text-obsidian-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              <Badge variant="outline" size="xs">
                {config.mode.toUpperCase()}
              </Badge>
            </div>
          )}

          {/* Projects Vault Quick Trigger */}
          <Button
            variant="ghost"
            size="xs"
            icon={<FolderKanban className="w-3.5 h-3.5 text-acid-lime" />}
            onClick={openProjectsModal}
            className="text-obsidian-muted hover:text-white"
          >
            Projects
          </Button>
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
            title="Save settings to project vault and cloud"
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
          <div
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
            title="Click to view profile & cloud sync"
          >
            <div className="w-7 h-7 rounded-xs bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-obsidian-muted group-hover:border-acid-lime transition-colors relative">
              <User className="w-3.5 h-3.5" />
              {isCloudConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-acid-lime absolute top-0.5 right-0.5 ring-2 ring-obsidian-950" />
              )}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-mono text-2xs uppercase text-white font-medium leading-none">
                {user ? user.displayName : 'CREATOR VAULT'}
              </span>
              <span className="font-mono text-[9px] text-obsidian-muted uppercase mt-0.5 leading-none flex items-center gap-1">
                {isCloudConnected ? (
                  <>
                    <Cloud className="w-2.5 h-2.5 text-electric-violet-light" />
                    <span>SUPABASE CLOUD</span>
                  </>
                ) : (
                  <span>LOCAL FIRST</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <ProjectsModal isOpen={isProjectsModalOpen} onClose={closeProjectsModal} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

