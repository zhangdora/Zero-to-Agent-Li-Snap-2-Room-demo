'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Asset, Room } from '@/lib/types';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  room?: Room;
  selectedAsset?: Asset;
  onRemoveAsset?: (assetId: string) => void;
  onScaleDown?: (assetId: string) => void;
  onScaleUp?: (assetId: string) => void;
  onFindOptions?: (assetId: string) => void;
}

export function PropertiesPanel({
  room,
  selectedAsset,
  onRemoveAsset,
  onScaleDown,
  onScaleUp,
  onFindOptions,
}: PropertiesPanelProps) {
  if (!selectedAsset && !room) {
    return (
      <div className="fixed right-0 top-14 bottom-0 w-80 bg-card border-l border-border p-4 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Select an asset or room</p>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-14 bottom-0 w-80 bg-card border-l border-border flex flex-col z-20">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Room Info or Asset Info */}
          {selectedAsset ? (
            <>
              {/* Selected Asset */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {selectedAsset.name}
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 text-foreground">
                      {selectedAsset.category}
                    </span>
                  </div>
                  {selectedAsset.dimensions && (
                    <>
                      <div>
                        <span className="text-muted-foreground">
                          Original size:
                        </span>
                        <span className="ml-2 text-foreground">
                          {selectedAsset.dimensions.width}w ×{' '}
                          {selectedAsset.dimensions.depth}d ×{' '}
                          {selectedAsset.dimensions.height}h cm
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Adapted size:
                        </span>
                        <span className="ml-2 text-foreground">
                          {Math.round(selectedAsset.dimensions.width * 0.95)}w ×{' '}
                          {Math.round(selectedAsset.dimensions.depth * 0.95)}d cm
                        </span>
                      </div>
                    </>
                  )}
                  {selectedAsset.material && (
                    <div>
                      <span className="text-muted-foreground">Material:</span>
                      <span className="ml-2 text-foreground">
                        {selectedAsset.material}
                      </span>
                    </div>
                  )}
                  {selectedAsset.color && (
                    <div>
                      <span className="text-muted-foreground">Color:</span>
                      <span className="ml-2 text-foreground">
                        {selectedAsset.color}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Doorway Check */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">
                  Doorway Check
                </h4>
                <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Passed
                </div>
              </div>

              {/* Room Fit */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">
                  Room Fit
                </h4>
                <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Good
                </div>
              </div>

              {/* Lowest Price */}
              <div>
                <span className="text-xs text-muted-foreground">
                  Lowest price:
                </span>
                <span className="ml-2 text-sm font-semibold text-foreground">
                  £450
                </span>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onScaleDown?.(selectedAsset.id)}
                  className="w-full justify-center gap-2"
                >
                  <Minus size={14} /> Make smaller
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFindOptions?.(selectedAsset.id)}
                  className="w-full"
                >
                  Find purchase options
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveAsset?.(selectedAsset.id)}
                  className="w-full justify-center gap-2"
                >
                  <Trash2 size={14} /> Remove from room
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Room Summary */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Room Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="ml-2 text-foreground">{room?.name}</span>
                  </div>
                  {room?.dimensions && (
                    <>
                      <div>
                        <span className="text-muted-foreground">
                          Dimensions:
                        </span>
                        <span className="ml-2 text-foreground">
                          {room.dimensions.width}w × {room.dimensions.depth}d ×{' '}
                          {room.dimensions.height}h m
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Door size:
                        </span>
                        <span className="ml-2 text-foreground">
                          {room.doorway?.width || 0.9}w × 2.1h m
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Current Workflow Step */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">
                  Workflow Step
                </h4>
                <p className="text-xs text-muted-foreground">
                  Room setup and asset generation in progress
                </p>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
