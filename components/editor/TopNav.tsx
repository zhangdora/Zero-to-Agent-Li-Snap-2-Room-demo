'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface TopNavProps {
  projectName?: string;
  onSave?: () => void;
  onNewProject?: () => void;
  onGenerateShoppingList?: () => void;
  isSignedIn?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function TopNav({
  projectName = 'New Project',
  onSave,
  onNewProject,
  onGenerateShoppingList,
  isSignedIn = false,
  onSignIn,
  onSignOut,
}: TopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-40">
      {/* Left: Logo/Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">S2R</span>
        </div>
        <span className="text-sm font-semibold text-foreground">Snap2Room</span>
      </div>

      {/* Center: Project Name */}
      <div className="flex-1 text-center">
        <h1 className="text-sm font-medium text-foreground">{projectName}</h1>
      </div>

      {/* Right: 4 buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onNewProject}
          className="text-xs gap-1"
        >
          <span>+</span>
          New Project
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="text-xs"
        >
          Save Project
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGenerateShoppingList}
          className="text-xs gap-1"
        >
          <ShoppingCart size={14} />
          Generate Shopping List
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={isSignedIn ? onSignOut : onSignIn}
          className="text-xs"
        >
          {isSignedIn ? 'Sign out' : 'Sign in'}
        </Button>
      </div>
    </header>
  );
}
