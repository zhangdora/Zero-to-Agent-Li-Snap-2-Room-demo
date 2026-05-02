'use client';

import { useMemo } from 'react';
import type { Room, Asset } from '@/lib/types';
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

interface Room2DCanvasProps {
  room?: Room;
  placedAssets: Asset[];
  selectedAssetId?: string;
  onSelectAsset?: (asset: Asset) => void;
}

interface FurnitureLayout {
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  color: string;
}

const FURNITURE_LAYOUTS: Record<string, FurnitureLayout> = {
  sofa: {
    x: 15,
    y: 60,
    width: 50,
    height: 25,
    color: 'bg-blue-100 border-blue-300',
  },
  'coffee-table': {
    x: 35,
    y: 45,
    width: 20,
    height: 15,
    color: 'bg-amber-100 border-amber-300',
  },
  'floor-lamp': {
    x: 8,
    y: 20,
    width: 12,
    height: 12,
    color: 'bg-yellow-100 border-yellow-300',
  },
  rug: {
    x: 20,
    y: 40,
    width: 45,
    height: 35,
    color: 'bg-purple-100 border-purple-300',
  },
  'tv-stand': {
    x: 32,
    y: 8,
    width: 30,
    height: 12,
    color: 'bg-green-100 border-green-300',
  },
};

export function Room2DCanvas({
  room,
  placedAssets,
  selectedAssetId,
  onSelectAsset,
}: Room2DCanvasProps) {
  if (!room) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600 mb-2">
            Create a room layout to begin
          </p>
          <p className="text-xs text-slate-500">
            Click the Room button in the left sidebar
          </p>
        </div>
      </div>
    );
  }

  const doorPosition = room.door?.position || 'front';

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 overflow-auto">
      {/* 2D Room Floor Plan */}
      <div className="relative aspect-video w-full max-w-4xl">
        {/* Room container with walls */}
        <div className="absolute inset-0 bg-white border-4 border-slate-300 rounded-lg shadow-lg relative overflow-hidden">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Door marker */}
          {doorPosition === 'front' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-400 rounded-t">
              <span className="absolute -top-5 left-0 text-xs font-bold text-red-600">
                Door
              </span>
            </div>
          )}
          {doorPosition === 'back' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-400 rounded-b">
              <span className="absolute -bottom-5 left-0 text-xs font-bold text-red-600">
                Door
              </span>
            </div>
          )}
          {doorPosition === 'left' && (
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-12 bg-red-400 rounded-r">
              <span className="absolute -left-10 top-0 text-xs font-bold text-red-600">
                Door
              </span>
            </div>
          )}
          {doorPosition === 'right' && (
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-12 bg-red-400 rounded-l">
              <span className="absolute -right-10 top-0 text-xs font-bold text-red-600">
                Door
              </span>
            </div>
          )}

          {/* Window on back wall */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-12 rounded border-2 border-blue-300 bg-blue-100" />

          {/* Placed furniture */}
          {placedAssets.map((asset) => {
            const layout = FURNITURE_LAYOUTS[asset.category] || {
              x: 30,
              y: 30,
              width: 20,
              height: 15,
              color: 'bg-slate-100 border-slate-300',
            };

            const Icon = CATEGORY_ICONS[asset.category] || Armchair;
            const isSelected = asset.id === selectedAssetId;

            return (
              <div
                key={asset.id}
                className="absolute group"
                style={{
                  left: `${layout.x}%`,
                  top: `${layout.y}%`,
                  width: `${layout.width}%`,
                  height: `${layout.height}%`,
                }}
              >
                <button
                  onClick={() => onSelectAsset?.(asset)}
                  className={cn(
                    'w-full h-full rounded border-2 flex items-center justify-center transition-all cursor-pointer',
                    layout.color,
                    isSelected && 'ring-2 ring-primary ring-offset-2 shadow-lg scale-105'
                  )}
                  title={`${asset.name} - ${asset.adaptedSize?.width}×${asset.adaptedSize?.depth}cm`}
                >
                  <Icon className="w-5 h-5 text-slate-600" />
                </button>

                {/* Hover label */}
                <div className="absolute -top-8 left-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {asset.name}
                </div>
              </div>
            );
          })}

          {/* Room dimensions labels */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-600">
            {room.dimensions.depth}m
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-600">
            {room.dimensions.width}m
          </div>
        </div>
      </div>
    </div>
  );
}
