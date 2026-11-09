import React, { useState, useEffect } from 'react';
import {
  X,
  FolderKanban,
  Plus,
  Save,
  Trash2,
  Copy,
  Edit2,
  Check,
  Cloud,
  HardDrive,
  ArrowUpRight,
  Clock,
  Layers,
} from 'lucide-react';
import { Button, IconButton, Badge } from '../ui';
import { useProjectStore, useStudioStore, useAuthStore } from '../../stores';
import { StudioProject } from '../../types';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({ isOpen, onClose }) => {
  const {
    projects,
    activeProjectId,
    isLoading,
    loadProjects,
    createProject,
    saveCurrentProject,
    reopenProject,
    renameProject,
    duplicateProject,
    deleteProject,
  } = useProjectStore();

  const { config, projectName, setProjectName, updateConfig } = useStudioStore();
  const { isCloudConnected } = useAuthStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen, loadProjects]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    const newProj = await createProject(newProjectTitle.trim());
    setProjectName(newProj.title);
    updateConfig(newProj.config);
    setNewProjectTitle('');
    setIsCreatingNew(false);
    showToast(`Created project "${newProj.title}"`);
  };

  const handleSaveActiveAsProject = async () => {
    const canvas = document.querySelector('canvas');
    const thumb = canvas ? canvas.toDataURL('image/jpeg', 0.5) : undefined;
    const saved = await saveCurrentProject(projectName, config, thumb);
    showToast(`Saved settings to "${saved.title}"`);
  };

  const handleReopen = (project: StudioProject) => {
    const opened = reopenProject(project.id);
    if (opened) {
      setProjectName(opened.title);
      updateConfig(opened.config);
      showToast(`Loaded "${opened.title}" into studio`);
      onClose();
    }
  };

  const handleStartRename = (project: StudioProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditTitle(project.title);
  };

  const handleSaveRename = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      await renameProject(id, editTitle.trim());
      if (activeProjectId === id) {
        setProjectName(editTitle.trim());
      }
      showToast('Project renamed');
    }
    setEditingId(null);
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = await duplicateProject(id);
    if (dup) {
      showToast(`Duplicated as "${dup.title}"`);
    }
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      await deleteProject(id);
      showToast(`Deleted "${title}"`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md select-none">
      <div className="w-full max-w-2xl bg-obsidian-surface border border-obsidian-border p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-obsidian-muted hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-acid-lime">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm uppercase tracking-widest text-white">
                Studio Projects Vault
              </h3>
              <p className="font-mono text-2xs text-obsidian-muted">
                {isCloudConnected ? 'Cloud synced & Local Storage' : 'Persistent Local Storage'} • {projects.length} saved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-6">
            <Button
              variant="outline"
              size="xs"
              icon={<Save className="w-3 h-3 text-acid-lime" />}
              onClick={handleSaveActiveAsProject}
            >
              Save Current
            </Button>
            <Button
              variant="primary"
              size="xs"
              icon={<Plus className="w-3 h-3 text-black" />}
              onClick={() => setIsCreatingNew((prev) => !prev)}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Toast Feedback */}
        {feedbackMsg && (
          <div className="mb-3 px-3 py-1.5 bg-acid-lime/10 border border-acid-lime/40 text-acid-lime font-mono text-xs flex items-center gap-2 rounded-xs animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Create New Project Form Drawer */}
        {isCreatingNew && (
          <form
            onSubmit={handleCreateNew}
            className="mb-4 p-3 bg-obsidian-950 border border-acid-lime/50 flex items-center gap-2 rounded-xs"
          >
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="e.g. MONOCHROME_PORTRAIT_04"
              autoFocus
              className="flex-1 bg-obsidian-subtle border border-obsidian-border px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-acid-lime"
            />
            <Button type="submit" variant="primary" size="xs">
              Create
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setIsCreatingNew(false)}
            >
              Cancel
            </Button>
          </form>
        )}

        {/* Projects List or Honest Empty State */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {isLoading ? (
            <div className="py-16 text-center font-mono text-xs text-obsidian-muted">
              Loading projects vault...
            </div>
          ) : projects.length === 0 ? (
            /* Honest, useful empty state */
            <div className="py-16 px-6 text-center border border-dashed border-obsidian-border rounded-xs bg-obsidian-950 flex flex-col items-center justify-center space-y-3">
              <FolderKanban className="w-8 h-8 text-obsidian-muted stroke-[1.25]" />
              <div className="space-y-1">
                <h4 className="font-display text-xs uppercase tracking-wider text-white">
                  No Saved Projects Yet
                </h4>
                <p className="font-mono text-2xs text-obsidian-muted max-w-sm">
                  Your project vault is completely empty. Click &apos;Save Current&apos; to archive
                  your active studio artwork or create a fresh workspace project.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="xs"
                  icon={<Save className="w-3 h-3 text-black" />}
                  onClick={handleSaveActiveAsProject}
                >
                  Save Active Artwork
                </Button>
              </div>
            </div>
          ) : (
            projects.map((project) => {
              const isActive = activeProjectId === project.id;
              const dateStr = new Date(project.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={project.id}
                  onClick={() => handleReopen(project)}
                  className={`p-3.5 border transition-all rounded-xs cursor-pointer group flex items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-obsidian-subtle border-acid-lime shadow-crisp-border'
                      : 'bg-obsidian-950 border-obsidian-border hover:border-obsidian-border-hover hover:bg-obsidian-surface'
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xs bg-obsidian-900 border border-obsidian-border flex items-center justify-center shrink-0 overflow-hidden relative">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Layers className="w-5 h-5 text-obsidian-muted" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingId === project.id ? (
                        <form
                          onSubmit={(e) => handleSaveRename(project.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5"
                        >
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus
                            className="bg-obsidian-surface border border-acid-lime px-2 py-0.5 font-mono text-xs text-white focus:outline-none w-48"
                          />
                          <IconButton size="xs" variant="lime" type="submit">
                            <Check className="w-3 h-3 text-black" />
                          </IconButton>
                        </form>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-white uppercase truncate">
                            {project.title}
                          </span>
                          {isActive && (
                            <Badge variant="lime" size="xs">
                              ACTIVE
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 font-mono text-2xs text-obsidian-muted mt-1">
                        <Badge variant="outline" size="xs">
                          {project.config.mode.toUpperCase()}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateStr}
                        </span>
                        <span className="flex items-center gap-1">
                          {project.syncedWithSupabase ? (
                            <>
                              <Cloud className="w-3 h-3 text-electric-violet-light" />
                              <span className="text-electric-violet-light">Cloud</span>
                            </>
                          ) : (
                            <>
                              <HardDrive className="w-3 h-3" />
                              <span>Local</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                    <IconButton
                      size="xs"
                      title="Rename Project"
                      onClick={(e) => handleStartRename(project, e)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </IconButton>

                    <IconButton
                      size="xs"
                      title="Duplicate Project"
                      onClick={(e) => handleDuplicate(project.id, e)}
                    >
                      <Copy className="w-3 h-3" />
                    </IconButton>

                    <IconButton
                      size="xs"
                      title="Delete Project"
                      onClick={(e) => handleDelete(project.id, project.title, e)}
                      className="hover:text-signal-coral hover:border-signal-coral"
                    >
                      <Trash2 className="w-3 h-3" />
                    </IconButton>

                    <Button
                      variant={isActive ? 'primary' : 'secondary'}
                      size="xs"
                      icon={<ArrowUpRight className="w-3 h-3" />}
                      iconPosition="right"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReopen(project);
                      }}
                    >
                      {isActive ? 'Active' : 'Open'}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

