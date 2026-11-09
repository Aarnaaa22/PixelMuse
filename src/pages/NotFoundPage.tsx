import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-obsidian px-6 text-center space-y-6">
      <span className="font-mono text-xs text-acid-lime uppercase tracking-widest">
        404 / Pipeline Segment Missing
      </span>
      <h1 className="font-display text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-tight">
        Null Coordinate
      </h1>
      <p className="font-mono text-xs text-obsidian-text max-w-sm">
        The requested studio route does not exist within the current matrix.
      </p>
      <Link to="/">
        <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
          Return To Studio Index
        </Button>
      </Link>
    </div>
  );
};

