'use client';

import { useState } from 'react';
import type { Asset, DetectedStyle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

interface GeneratedModelsPanelProps {
  assets: Asset[];
  selectedAssetId?: string;
  onSelectAsset: (asset: Asset) => void;
  onAddToLibrary: (assetId: string) => void;
  onAddAll: () => void;
  isLoading?: boolean;
  detectedStyle?: DetectedStyle;
}

export function GeneratedModelsPanel({
  assets,
  selectedAssetId,
  onSelectAsset,
  onAddToLibrary,
  onAddAll,
  isLoading = false,
  detectedStyle,
}: GeneratedModelsPanelProps) {
  const [filter, setFilter] = useState<string>('all');

  // Map category types for filtering
  const CATEGORY_MAP: Record<string, string[]> = {
    all: [],
    seating: ['sofa'],
    tables: ['coffee-table'],
    storage: [],
    lighting: ['floor-lamp'],
    rugs: ['rug'],
  };

  const filteredAssets =
    filter === 'all'
      ? assets
      : assets.filter((a) => CATEGORY_MAP[filter]?.includes(a.category));

  const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'seating', label: 'Seating' },
    { value: 'tables', label: 'Tables' },
    { value: 'storage', label: 'Storage' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'rugs', label: 'Rugs' },
  ];

  if (isLoading || assets.length === 0) {
    return (
      <div className="w-64 bg-card border-r border-border h-full flex flex-col p-4">
        <h2 className="font-semibold text-sm mb-1">Generated Models</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Detected from your inspiration image
        </p>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Generating models...' : 'Upload inspiration to see generated models'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm mb-1">Generated Models</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Detected from your inspiration image
        </p>

        {/* Detected style summary */}
        {detectedStyle && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">
              Detected: {detectedStyle.style}
            </p>
            <p className="text-xs text-blue-800">
              {detectedStyle.colors.join(', ')} • {detectedStyle.materials.join(', ')}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredAssets.map((asset) => {
          const Icon = CATEGORY_ICONS[asset.category] || Armchair;
          const isSelected = asset.id === selectedAssetId;

          return (
            <div
              key={asset.id}
              className={cn(
                'p-3 rounded border-2 cursor-pointer transition-all hover:bg-muted',
                isSelected
                  ? 'border-primary bg-blue-50'
                  : 'border-border bg-background'
              )}
              onClick={() => onSelectAsset(asset)}
            >
              {/* Thumbnail placeholder */}
              <div className="w-full h-24 bg-muted rounded mb-2 flex items-center justify-center">
                <Icon className="w-8 h-8 text-muted-foreground" />
              </div>

              {/* Asset name */}
              <p className="text-xs font-semibold mb-1">{asset.name}</p>

              {/* Size badge */}
              <div className="flex gap-1 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {asset.adaptedSize?.width}×{asset.adaptedSize?.depth}cm
                </Badge>
              </div>

              {/* Status badges */}
              <div className="flex gap-1 mb-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    asset.fitStatus === 'good'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : ''
                  )}
                >
                  {asset.fitStatus}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    asset.doorwayStatus === 'passed'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : ''
                  )}
                >
                  {asset.doorwayStatus}
                </Badge>
              </div>

              {/* Add button */}
              <Button
                size="sm"
                className="w-full text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToLibrary(asset.id);
                }}
              >
                Add to Library
              </Button>
            </div>
          );
        })}
      </div>

      {/* Add All Button */}
      {assets.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={onAddAll}
          >
            Add all to My Library
          </Button>
        </div>
      )}
    </div>
  );
}

