'use client';

import type { Asset, Room } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProjectSummaryCard } from '@/components/panels/RoomSummaryCard';
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

interface AssetDetailPanelProps {
  asset?: Asset;
  room?: Room;
  placedAssets?: Asset[];
  projectName?: string;
  onAddToLibrary?: (assetId: string) => void;
  onPlaceInRoom?: (assetId: string) => void;
  onFindOptions?: (assetId: string) => void;
  onRemoveFromLibrary?: (assetId: string) => void;
  isInLibrary?: boolean;
  isPlacedInRoom?: boolean;
}

export function AssetDetailPanel({
  asset,
  room,
  placedAssets = [],
  projectName = 'My Project',
  onAddToLibrary,
  onPlaceInRoom,
  onFindOptions,
  onRemoveFromLibrary,
  isInLibrary = false,
  isPlacedInRoom = false,
}: AssetDetailPanelProps) {
  if (!asset) {
    // Show project summary if room exists
    if (room) {
      return (
        <div className="w-80 bg-card border-l border-border h-full flex flex-col p-4 overflow-y-auto">
          <ProjectSummaryCard
            projectName={projectName}
            roomType={room.type || 'Living Room'}
            width={room.dimensions.width}
            depth={room.dimensions.depth}
            height={room.dimensions.height}
            doorWidth={room.door?.width || room.doorway?.width || 0.8}
            doorHeight={room.door?.height || room.doorway?.height || 2.0}
            doorPosition={room.door?.position || room.doorway?.position || 'front'}
            budget={room.budget}
            placedAssets={placedAssets}
            defaultExpanded={true}
          />
        </div>
      );
    }

    // Empty state when no room and no asset
    return (
      <div className="w-80 bg-card border-l border-border h-full flex items-center justify-center">
        <p className="text-xs text-muted-foreground text-center px-4">
          Create a room to begin
        </p>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[asset.category] || Armchair;

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col overflow-hidden">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-b border-border">
        <Icon className="w-16 h-16 text-muted-foreground/50" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Badge */}
        <Badge variant="outline" className="w-fit">
          Detected from Inspiration
        </Badge>

        {/* Asset name */}
        <div>
          <h3 className="font-bold text-base">{asset.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{asset.style}</p>
        </div>

        <Separator />

        {/* Category and basic info */}
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-xs text-muted-foreground">
              CATEGORY
            </p>
            <p className="text-sm capitalize">
              {asset.category.replace('-', ' ')}
            </p>
          </div>

          {asset.color && (
            <div>
              <p className="font-semibold text-xs text-muted-foreground">
                COLOUR
              </p>
              <p className="text-sm capitalize">{asset.color}</p>
            </div>
          )}

          {asset.material && (
            <div>
              <p className="font-semibold text-xs text-muted-foreground">
                MATERIAL
              </p>
              <p className="text-sm capitalize">{asset.material}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Dimensions */}
        <div className="space-y-2 text-sm">
          <div>
            <p className="font-semibold text-xs text-muted-foreground">
              ORIGINAL SIZE
            </p>
            <p className="text-sm">
              {asset.originalSize?.width} × {asset.originalSize?.depth} × {asset.originalSize?.height} cm
            </p>
          </div>

          <div>
            <p className="font-semibold text-xs text-muted-foreground">
              ADAPTED SIZE
            </p>
            <p className="text-sm">
              {asset.adaptedSize?.width} × {asset.adaptedSize?.depth} × {asset.adaptedSize?.height} cm
            </p>
          </div>
        </div>

        <Separator />

        {/* Status */}
        <div className="space-y-2 text-sm">
          <div>
            <p className="font-semibold text-xs text-muted-foreground">
              FIT STATUS
            </p>
            <Badge
              variant="outline"
              className={
                asset.fitStatus === 'good'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : ''
              }
            >
              {asset.fitStatus}
            </Badge>
          </div>

          <div>
            <p className="font-semibold text-xs text-muted-foreground">
              DOORWAY STATUS
            </p>
            <Badge
              variant="outline"
              className={
                asset.doorwayStatus === 'passed'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : ''
              }
            >
              {asset.doorwayStatus}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Meta */}
        <div className="space-y-2 text-sm">
          <div>
            <p className="font-semibold text-xs text-muted-foreground">
              SOURCE
            </p>
            <p className="text-sm">{asset.source}</p>
          </div>

          <div>
            <p className="font-semibold text-xs text-muted-foreground">
              MODEL ID
            </p>
            <p className="text-sm font-mono text-xs">{asset.id}</p>
          </div>

          {asset.lowestPrice && (
            <div>
              <p className="font-semibold text-xs text-muted-foreground">
                LOWEST PRICE
              </p>
              <p className="text-sm font-bold">£{asset.lowestPrice}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {!isInLibrary && (
          <Button
            className="w-full text-xs"
            onClick={() => onAddToLibrary?.(asset.id)}
          >
            Add to Library
          </Button>
        )}

        {isInLibrary && !isPlacedInRoom && (
          <Button
            className="w-full text-xs"
            onClick={() => onPlaceInRoom?.(asset.id)}
          >
            Place in Room
          </Button>
        )}

        {isInLibrary && isPlacedInRoom && (
          <>
            <Button
              className="w-full text-xs"
              onClick={() => onPlaceInRoom?.(asset.id)}
            >
              Place in Room
            </Button>
            <Button
              variant="outline"
              className="w-full text-xs"
              onClick={() => onFindOptions?.(asset.id)}
            >
              Find Purchase Options
            </Button>
          </>
        )}

        {isInLibrary && !isPlacedInRoom && (
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={() => onFindOptions?.(asset.id)}
          >
            Find Purchase Options
          </Button>
        )}

        {isInLibrary && (
          <Button
            variant="ghost"
            className="w-full text-xs text-destructive hover:text-destructive"
            onClick={() => onRemoveFromLibrary?.(asset.id)}
          >
            Remove from Library
          </Button>
        )}
      </div>
    </div>
  );
}
