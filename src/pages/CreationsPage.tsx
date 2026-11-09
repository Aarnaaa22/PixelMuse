import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Library, ArrowUpRight, Trash2, Calendar } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { CreationRecord } from '../types';
import { useStudioStore } from '../stores';

export const CreationsPage: React.FC = () => {
  const navigate = useNavigate();
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const setProjectName = useStudioStore((s) => s.setProjectName);
  const [creations, setCreations] = useState<CreationRecord[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pixelmuse_creations') || '[]');
      setCreations(stored);
    } catch {
      setCreations([]);
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = creations.filter((c) => c.id !== id);
    setCreations(filtered);
    localStorage.setItem('pixelmuse_creations', JSON.stringify(filtered));
  };

  const handleOpenCreation = (creation: CreationRecord) => {
    updateConfig(creation.config);
    setProjectName(creation.title);
    navigate('/studio');
  };

  return (
    <div className="flex-1 bg-obsidian px-6 py-12 max-w-7xl mx-auto w-full">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-obsidian-border">
        <div className="space-y-2">
          <Badge variant="outline" dot>
            Studio Vault
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            Your Studio Creations
          </h1>
          <p className="font-mono text-xs text-obsidian-text max-w-xl">
            Artifacts, exported master renders, and custom presets saved during this session.
          </p>
        </div>

        <Link to="/studio">
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowUpRight className="w-3.5 h-3.5 text-black" />}
            iconPosition="right"
          >
            New Creation
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {creations.length === 0 ? (
        <div className="mt-12 border border-obsidian-border bg-obsidian-surface p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-obsidian-muted">
            <Library className="w-5 h-5" />
          </div>

          <h3 className="font-display text-lg uppercase tracking-wider text-white">
            No Exported Artifacts Yet
          </h3>

          <p className="font-mono text-xs text-obsidian-text max-w-md leading-relaxed">
            Open the Studio, upload a photograph, refine your ASCII, dithering, or mosaic parameters,
            and select <span className="text-acid-lime">Save to Gallery</span> in the export dialog to
            build your collection.
          </p>

          <div className="pt-2">
            <Link to="/studio">
              <Button variant="secondary" size="sm">
                Open Canvas Studio
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Saved Creations Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {creations.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenCreation(item)}
              className="border border-obsidian-border bg-obsidian-surface p-4 flex flex-col justify-between group hover:border-acid-lime/70 transition-colors cursor-pointer rounded-xs"
            >
              <div className="space-y-3">
                {/* Thumbnail */}
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
                    onClick={(e) => handleDelete(item.id, e)}
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
  );
};
