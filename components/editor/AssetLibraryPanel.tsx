'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Empty } from '@/components/ui/empty';
import { Asset } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AssetLibraryPanelProps {
  category: string;
  assets: Asset[];
  selectedAssetId?: string;
  onSelectAsset: (assetId: string) => void;
  onPlaceAsset: (assetId: string) => void;
  onRemoveAsset?: (assetId: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  room: 'Create Room',
  inspiration: 'Inspiration',
  mylibrary: 'My Library',
  seating: 'Seating',
  tables: 'Tables',
  storage: 'Storage',
  lighting: 'Lighting',
  rugs: 'Rugs',
  decor: 'Decor',
  plants: 'Plants',
  buy: 'Buy Options',
  checkout: 'Checkout',
};

export function AssetLibraryPanel({
  category,
  assets,
  selectedAssetId,
  onSelectAsset,
  onPlaceAsset,
  onRemoveAsset,
}: AssetLibraryPanelProps) {
  const label = CATEGORY_LABELS[category] || 'Library';

  return (
    <div className="fixed left-16 top-14 bottom-0 w-56 bg-card border-r border-border flex flex-col z-20">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{label}</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Generated from your inspiration image
        </p>
        <p className="text-xs text-muted-foreground italic mt-2">
          No public library. Only your scanned assets appear here.
        </p>
      </div>

      {/* Content */}
      {assets.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <Empty
            title="No assets yet"
            description="Generate or upload assets to get started"
          />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className={cn(
                  'p-3 rounded border transition-all cursor-pointer',
                  selectedAssetId === asset.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-secondary'
                )}
                onClick={() => onSelectAsset(asset.id)}
              >
                {/* Thumbnail placeholder */}
                <div className="w-full h-24 bg-muted rounded mb-2 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {asset.name}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-foreground truncate">
                  {asset.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {asset.category}
                </p>

                {asset.dimensions && (
                  <p className="text-xs text-muted-foreground">
                    {asset.dimensions.width}w × {asset.dimensions.depth}d
                  </p>
                )}

                <div className="flex gap-1 mt-2">
                  <Button
                    size="xs"
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaceAsset(asset.id);
                    }}
                    className="flex-1 text-xs h-7"
                  >
                    Place
                  </Button>
                  {onRemoveAsset && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAsset(asset.id);
                      }}
                      className="flex-1 text-xs h-7"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
