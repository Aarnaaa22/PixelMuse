import React from 'react';
import { Link } from 'react-router-dom';
import { Library, ArrowUpRight } from 'lucide-react';
import { Button, Badge } from '../components/ui';

export const CreationsPage: React.FC = () => {
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

      {/* Empty State / Session Library placeholder with high-end editorial treatment */}
      <div className="mt-12 border border-obsidian-border bg-obsidian-surface p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-obsidian-muted">
          <Library className="w-5 h-5" />
        </div>

        <h3 className="font-display text-lg uppercase tracking-wider text-white">
          No Exported Artifacts Yet
        </h3>

        <p className="font-mono text-xs text-obsidian-text max-w-md leading-relaxed">
          Open the Studio, upload a photograph, refine your ASCII, dithering, or mosaic parameters,
          and select <span className="text-acid-lime">Export Art</span> to build your collection.
        </p>

        <div className="pt-2">
          <Link to="/studio">
            <Button variant="secondary" size="sm">
              Open Canvas Studio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
