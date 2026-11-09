import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  ArrowUpRight,
  Trash2,
  Calendar,
  Copy,
  Plus,
  Cloud,
  HardDrive,
  Download,
} from 'lucide-react';
import { Button, Badge, IconButton } from '../components/ui';
import { SiteFooter } from '../components/common';
import { CreationRecord, StudioProject } from '../types';
import { useStudioStore, useProjectStore, useAuthStore } from '../stores';

export const CreationsPage: React.FC = () => {
  const navigate = useNavigate();
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const setProjectName = useStudioStore((s) => s.setProjectName);

  const {
    projects,
    loadProjects,
    deleteProject,
    duplicateProject,
    reopenProject,
    createProject,
  } = useProjectStore();

  const { isCloudConnected } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'projects' | 'exports'>('projects');
  const [creations, setCreations] = useState<CreationRecord[]>([]);

  useEffect(() => {
    loadProjects();
    try {
      const stored = JSON.parse(localStorage.getItem('pixelmuse_creations') || '[]');
      setCreations(stored);
    } catch {
      setCreations([]);
    }
  }, [loadProjects]);

  const handleDeleteCreation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this exported record from local vault?')) {
      const filtered = creations.filter((c) => c.id !== id);
      setCreations(filtered);
      localStorage.setItem('pixelmuse_creations', JSON.stringify(filtered));
    }
  };

  const handleOpenCreation = (creation: CreationRecord) => {
    updateConfig(creation.config);
    setProjectName(creation.title);
    navigate('/studio');
  };

  const handleOpenProject = (project: StudioProject) => {
    const opened = reopenProject(project.id);
    if (opened) {
      updateConfig(opened.config);
      setProjectName(opened.title);
      navigate('/studio');
    }
  };

  const handleDuplicateProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await duplicateProject(id);
  };

  const handleDeleteProject = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Permanently delete project "${title}"?`)) {
      await deleteProject(id);
    }
  };

  const handleNewProject = async () => {
    const newProj = await createProject();
    setProjectName(newProj.title);
    updateConfig(newProj.config);
    navigate('/studio');
  };

  return (
    <div className="flex-1 flex flex-col bg-obsidian text-obsidian-heading">
      <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-obsidian-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" dot>
                Studio Vault
              </Badge>
              {isCloudConnected ? (
                <Badge variant="lime" size="xs">
                  <Cloud className="w-3 h-3 mr-1 inline" />
                  Cloud Synced
                </Badge>
              ) : (
                <Badge variant="outline" size="xs">
                  <HardDrive className="w-3 h-3 mr-1 inline" />
                  Local Storage
                </Badge>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              Your Studio Archive
            </h1>
            <p className="font-mono text-xs text-obsidian-text max-w-xl">
              Saved workspace configurations, active project drafts, and exported master artwork.
              Raw photograph files remain private on your device.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 text-black" />}
              iconPosition="right"
              onClick={handleNewProject}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 pt-6 pb-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-xs border transition-colors flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-acid-lime bg-obsidian-surface text-white font-bold'
                : 'border-obsidian-border text-obsidian-muted hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-acid-lime" />
            <span>Saved Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('exports')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-xs border transition-colors flex items-center gap-2 ${
              activeTab === 'exports'
                ? 'border-acid-lime bg-obsidian-surface text-white font-bold'
                : 'border-obsidian-border text-obsidian-muted hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-electric-violet-light" />
            <span>Exported Renders ({creations.length})</span>
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            {projects.length === 0 ? (
              /* Honest, useful empty state for projects */
              <div className="mt-8 border border-dashed border-obsidian-border bg-obsidian-surface p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-xs">
                <div className="w-12 h-12 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-obsidian-muted">
                  <FolderKanban className="w-6 h-6 stroke-[1.25]" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-base uppercase tracking-wider text-white">
                    No Saved Projects In Vault
                  </h3>
                  <p className="font-mono text-xs text-obsidian-text max-w-md leading-relaxed">
                    You haven&apos;t saved any studio projects yet. Open the Canvas Studio, craft your
                    generative artwork, and click <span className="text-acid-lime">Save</span> in the top toolbar.
                  </p>
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="sm" onClick={handleNewProject}>
                    Launch Canvas Studio
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project)}
                    className="border border-obsidian-border bg-obsidian-surface p-4 flex flex-col justify-between group hover:border-acid-lime transition-all cursor-pointer rounded-xs"
                  >
                    <div className="space-y-3">
                      {/* Thumbnail or Generative Placeholder */}
                      <div className="aspect-video w-full bg-obsidian-950 border border-obsidian-border overflow-hidden rounded-xs relative flex items-center justify-center">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <FolderKanban className="w-8 h-8 text-obsidian-muted" />
                            <span className="font-mono text-[10px] text-obsidian-muted uppercase">
                              Formula Snapshot
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2 left-2">
                          <Badge variant="outline" size="xs">
                            {project.config.mode.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="absolute top-2 right-2">
                          {project.syncedWithSupabase ? (
                            <Badge variant="lime" size="xs">
                              <Cloud className="w-2.5 h-2.5 mr-1 inline" />
                              Cloud
                            </Badge>
                          ) : (
                            <Badge variant="outline" size="xs">
                              <HardDrive className="w-2.5 h-2.5 mr-1 inline" />
                              Local
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-base font-bold uppercase text-white truncate group-hover:text-acid-lime transition-colors">
                          {project.title}
                        </h3>

                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                          <IconButton
                            size="xs"
                            title="Duplicate Project"
                            onClick={(e) => handleDuplicateProject(project.id, e)}
                          >
                            <Copy className="w-3 h-3" />
                          </IconButton>

                          <IconButton
                            size="xs"
                            title="Delete Project"
                            onClick={(e) => handleDeleteProject(project.id, project.title, e)}
                            className="hover:text-signal-coral"
                          >
                            <Trash2 className="w-3 h-3" />
                          </IconButton>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-2xs text-obsidian-muted">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>CELL: {project.config.renderParams.cellSize}px</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-obsidian-border flex items-center justify-between">
                      <span className="font-mono text-2xs text-acid-lime uppercase flex items-center gap-1 group-hover:underline">
                        <span>Reopen In Studio</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Exports Tab */}
        {activeTab === 'exports' && (
          <div>
            {creations.length === 0 ? (
              /* Honest, useful empty state for exports */
              <div className="mt-8 border border-dashed border-obsidian-border bg-obsidian-surface p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-xs">
                <div className="w-12 h-12 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-obsidian-muted">
                  <Download className="w-6 h-6 stroke-[1.25]" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-base uppercase tracking-wider text-white">
                    No Exported Master Renders Yet
                  </h3>
                  <p className="font-mono text-xs text-obsidian-text max-w-md leading-relaxed">
                    When you export high-resolution PNG, WebP, or ASCII matrix renders from the Studio
                    Export dialog, records of your master artwork will appear here.
                  </p>
                </div>

                <div className="pt-2">
                  <Link to="/studio">
                    <Button variant="secondary" size="sm">
                      Open Canvas Studio
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {creations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenCreation(item)}
                    className="border border-obsidian-border bg-obsidian-surface p-4 flex flex-col justify-between group hover:border-acid-lime transition-all cursor-pointer rounded-xs"
                  >
                    <div className="space-y-3">
                      <div className="aspect-square w-full bg-obsidian-950 border border-obsidian-border overflow-hidden rounded-xs relative">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-2xs text-obsidian-muted">
                            NO THUMBNAIL
                          </div>
                        )}

                        <div className="absolute top-2 left-2">
                          <Badge variant="outline" size="xs">
                            {item.mode.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-base font-bold uppercase text-white truncate group-hover:text-acid-lime transition-colors">
                          {item.title}
                        </h3>
                        <button
                          onClick={(e) => handleDeleteCreation(item.id, e)}
                          className="text-obsidian-muted hover:text-signal-coral p-1"
                          title="Delete Artifact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-2xs text-obsidian-muted">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{item.exportFormat.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-obsidian-border flex items-center justify-between">
                      <span className="font-mono text-2xs text-acid-lime uppercase flex items-center gap-1">
                        <span>Reopen In Studio</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
};
