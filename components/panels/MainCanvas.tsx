'use client';

import { useState } from 'react';
import { Grid3x3, RotateCcw, Trash2, View } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Room2DCanvas } from './Room2DCanvas';
import { RoomScene3DWrapper } from '@/components/RoomScene3DWrapper';
import type { Room, Asset } from '@/lib/types';

interface MainCanvasProps {
  room?: Room;
  placedAssets: Asset[];
  selectedAssetId?: string | null;
  onSelectAsset?: (asset: Asset | null) => void;
  onRemoveAsset?: (assetId: string) => void;
}

export function MainCanvas({
  room,
  placedAssets,
  selectedAssetId,
  onSelectAsset,
  onRemoveAsset,
}: MainCanvasProps) {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [resetToken, setResetToken] = useState(0);

  return (
    <div className="flex-1 bg-slate-50 relative min-w-0">
      {room && (
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-md border border-border bg-card/95 p-1 shadow-sm backdrop-blur">
          <ButtonGroup>
            <Button
              variant={viewMode === '2d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('2d')}
              title="2D view"
              className="h-8 gap-1.5 px-3"
            >
              <Grid3x3 size={14} />
              2D
            </Button>
            <Button
              variant={viewMode === '3d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('3d')}
              title="3D view"
              className="h-8 gap-1.5 px-3"
            >
              <View size={14} />
              3D
            </Button>
          </ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetToken((value) => value + 1)}
            title="Reset view"
            className="h-8 w-8 p-0"
          >
            <RotateCcw size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedAssetId && onRemoveAsset?.(selectedAssetId)}
            disabled={!selectedAssetId || !onRemoveAsset}
            title="Delete selected"
            className="h-8 w-8 p-0"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
      {room ? (
        viewMode === '3d' ? (
          <RoomScene3DWrapper
            room={room}
            placedAssets={placedAssets}
            selectedAssetId={selectedAssetId ?? null}
            onSelectAsset={(assetId) => {
              const asset = placedAssets.find((item) => item.id === assetId);
              onSelectAsset?.(asset ?? null);
            }}
            onRemoveAsset={onRemoveAsset}
            resetToken={resetToken}
          />
        ) : (
          <Room2DCanvas
            room={room}
            placedAssets={placedAssets}
            selectedAssetId={selectedAssetId ?? undefined}
            onSelectAsset={onSelectAsset ?? undefined}
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Create a new project to generate a room preview.</p>
          </div>
        </div>
      )}
    </div>
  );
}
