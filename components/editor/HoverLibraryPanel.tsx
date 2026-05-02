'use client';

import { useState } from 'react';
import type { Asset } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FurniturePhotoThumbnail } from '@/components/ui/furniture-photo-thumbnail';
import { cn } from '@/lib/utils';
import {
  Armchair,
  Coffee,
  Lamp,
  Square,
  Tv,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sofa: Armchair,
  'coffee-table': Coffee,
  'floor-lamp': Lamp,
  rug: Square,
  'tv-stand': Tv,
};

interface HoverLibraryPanelProps {
  isVisible: boolean;
  category: string;
  flyoutTop?: number;
  onClose?: () => void;
  roomSummary?: {
    width: number;
    depth: number;
    height: number;
    doorWidth: number;
    budget: number;
  };
  assets?: Asset[];
  onAddFurniture?: (asset: Asset) => void;
}

export function HoverLibraryPanel({
  isVisible,
  category,
  flyoutTop = 70,
  onClose,
  roomSummary,
  assets = [],
  onAddFurniture,
}: HoverLibraryPanelProps) {
  if (!isVisible) return null;

  // Room summary content
  if (category === 'room' && roomSummary) {
    return (
      <div 
        className="fixed left-16 w-64 bg-card border border-border rounded-r-lg shadow-lg p-4 z-40 animate-in fade-in slide-in-from-left-2 duration-200"
        style={{ top: `${flyoutTop}px` }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Room Summary</h3>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Width:</span>
            <span className="font-medium">{roomSummary.width}m</span>
          </div>
          <div className="flex justify-between">
            <span>Depth:</span>
            <span className="font-medium">{roomSummary.depth}m</span>
          </div>
          <div className="flex justify-between">
            <span>Height:</span>
            <span className="font-medium">{roomSummary.height}m</span>
          </div>
          <div className="flex justify-between">
            <span>Door:</span>
            <span className="font-medium">{roomSummary.doorWidth}m wide</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span>Budget:</span>
            <span className="font-medium">${roomSummary.budget}</span>
          </div>
        </div>
      </div>
    );
  }

  // Inspiration content
  if (category === 'inspiration') {
    return (
      <div 
        className="fixed left-16 w-64 bg-card border border-border rounded-r-lg shadow-lg p-4 z-40 animate-in fade-in slide-in-from-left-2 duration-200"
        style={{ top: `${flyoutTop}px` }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Inspiration</h3>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="w-full h-40 bg-muted rounded mb-3" />
        <p className="text-xs text-muted-foreground">Detected style: Warm minimal</p>
      </div>
    );
  }

  // Library/category content
  if (assets && assets.length > 0) {
    const categoryLabel = category === 'mylibrary' ? 'My Library' : category.charAt(0).toUpperCase() + category.slice(1);
    return (
      <div 
        className="fixed left-16 w-64 bg-card border border-border rounded-r-lg shadow-lg max-h-[calc(100vh-60px)] overflow-y-auto z-40 animate-in fade-in slide-in-from-left-2 duration-200"
        style={{ top: `${flyoutTop}px` }}
      >
        <div className="p-4 sticky top-0 bg-card border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">{categoryLabel}</h3>
            <p className="text-xs text-muted-foreground mt-1">{assets.length} items</p>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            ✕
          </button>
        </div>
        <div className="p-3 space-y-2">
          {assets.map((asset) => {
            return (
              <div
                key={asset.id}
                className="p-3 rounded border border-border hover:bg-muted transition-colors space-y-2"
              >
                <div className="w-full h-24 bg-white rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
                  <FurniturePhotoThumbnail category={asset.category} size="md" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium truncate">{asset.name}</p>
                  {asset.adaptedSize && (
                    <p className="text-xs text-muted-foreground">
                      {asset.adaptedSize.width}×{asset.adaptedSize.depth}cm
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => onAddFurniture?.(asset)}
                >
                  {asset.placedInRoom ? 'Already Placed' : 'Add to Canvas'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Empty state for categories without items
  if (category === 'buy' || category === 'checkout') {
    const title = category === 'buy' ? 'Buy' : 'Checkout';
    return (
      <div 
        className="fixed left-16 w-64 bg-card border border-border rounded-r-lg shadow-lg p-4 z-40 animate-in fade-in slide-in-from-left-2 duration-200"
        style={{ top: `${flyoutTop}px` }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">{title}</h3>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Add items to your library first</p>
      </div>
    );
  }

  return null;
}
