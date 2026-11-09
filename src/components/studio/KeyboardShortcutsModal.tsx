import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from '../ui';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Toggle Motion Play / Pause' },
    { key: 'S', desc: 'Toggle Split Comparison View' },
    { key: 'F', desc: 'Fit Canvas to Screen' },
    { key: 'R', desc: 'Reset Canvas Pan & Zoom' },
    { key: '1 - 5', desc: 'Switch Modes (Mosaic, Pixel, ASCII, Dots, Dither)' },
    { key: 'Ctrl + S', desc: 'Quick Save Project to Vault' },
    { key: 'Ctrl + E', desc: 'Open Master Export Dialog' },
    { key: 'Ctrl + Z', desc: 'Undo Parameter Change' },
    { key: 'Ctrl + Y', desc: 'Redo Parameter Change' },
    { key: '?', desc: 'Toggle Keyboard Shortcuts Cheat Sheet' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md select-none">
      <div className="w-full max-w-md bg-obsidian-surface border border-obsidian-border p-6 shadow-2xl relative rounded-xs">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-obsidian-muted hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-4 h-4 text-acid-lime" />
          <h3 className="font-display text-sm uppercase tracking-widest text-white">
            Studio Keyboard Shortcuts
          </h3>
        </div>

        <div className="divide-y divide-obsidian-border/60">
          {shortcuts.map((item, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between font-mono text-2xs">
              <span className="text-obsidian-text">{item.desc}</span>
              <kbd className="px-2 py-0.5 bg-obsidian-950 border border-obsidian-border text-acid-lime font-semibold rounded-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-obsidian-border flex justify-end">
          <Button variant="secondary" size="xs" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
