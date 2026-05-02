'use client';

import type { Asset, Room } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Sofa, Coffee, Lamp, Square, Tv } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sofa: Sofa,
  'coffee-table': Coffee,
  'floor-lamp': Lamp,
  rug: Square,
  'tv-stand': Tv,
};

const FURNITURE_POSITIONS: Record<
  string,
  { x: number; y: number; width: number; height: number }
> = {
  sofa: { x: 20, y: 55, width: 60, height: 20 },
  'coffee-table': { x: 35, y: 40, width: 25, height: 15 },
  'floor-lamp': { x: 5, y: 20, width: 10, height: 10 },
  rug: { x: 25, y: 30, width: 50, height: 35 },
  'tv-stand': { x: 30, y: 8, width: 40, height: 10 },
};

const FURNITURE_COLORS: Record<string, string> = {
  sofa: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
  'coffee-table': 'bg-amber-100 border-amber-300 hover:bg-amber-200',
  'floor-lamp': 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
  rug: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
  'tv-stand': 'bg-green-100 border-green-300 hover:bg-green-200',
};

interface Room3DPreviewProps {
  room?: Room;
  selectedAssetId?: string | null;
  onSelectAsset?: (asset: Asset) => void;
}

export function Room3DPreview({
  room,
  selectedAssetId,
  onSelectAsset,
}: Room3DPreviewProps) {
  const assets = room?.assets || [];
  const placedAssets = assets.filter((a) => a.placedInRoom);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 relative">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(100,100,100,.05) 25%, rgba(100,100,100,.05) 26%, transparent 27%, transparent 74%, rgba(100,100,100,.05) 75%, rgba(100,100,100,.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(100,100,100,.05) 25%, rgba(100,100,100,.05) 26%, transparent 27%, transparent 74%, rgba(100,100,100,.05) 75%, rgba(100,100,100,.05) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Room Box - 3D Editor Style */}
      <div className="relative w-4/5 h-4/5 max-w-4xl">
        {/* Floor */}
        <div className="absolute inset-x-8 bottom-8 h-2/3 bg-white border-2 border-slate-300 rounded-lg shadow-lg relative overflow-hidden">
          {/* Subtle floor grid */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full">
              <defs>
                <pattern
                  id="roomgrid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#roomgrid)" />
            </svg>
          </div>

          {/* Door marker */}
          <div className="absolute bottom-0 left-12 w-12 h-1 bg-red-400 rounded-t">
            <span className="absolute -top-5 left-0 text-xs font-bold text-red-600">
              Door
            </span>
          </div>

          {/* Placed Furniture */}
          {placedAssets.map((asset) => {
            const pos = FURNITURE_POSITIONS[asset.category] || {
              x: 40,
              y: 40,
              width: 20,
              height: 15,
            };
            const colorClass =
              FURNITURE_COLORS[asset.category] ||
              'bg-slate-100 border-slate-300';
            const Icon = CATEGORY_ICONS[asset.category] || Sofa;
            const isSelected = asset.id === selectedAssetId;

            return (
              <div
                key={asset.id}
                className="absolute group"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: `${pos.width}%`,
                  height: `${pos.height}%`,
                }}
              >
                <button
                  onClick={() => onSelectAsset?.(asset)}
                  className={cn(
                    'w-full h-full rounded border-2 flex items-center justify-center transition-all cursor-pointer',
                    colorClass,
                    isSelected &&
                      'ring-2 ring-blue-500 ring-offset-2 shadow-lg'
                  )}
                  title={`${asset.name} - ${asset.dimensions?.width || 'N/A'}×${asset.dimensions?.depth || 'N/A'}cm`}
                >
                  <Icon className="w-5 h-5 text-slate-600" />
                </button>

                {/* Label on hover */}
                <div className="absolute -top-8 left-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {asset.name}
                </div>
              </div>
            );
          })}

          {/* Dimension labels */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
            {room?.dimensions?.width || 0}m
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-500 font-medium">
            {room?.dimensions?.depth || 0}m
          </div>
        </div>

        {/* Back Wall */}
        <div className="absolute inset-x-8 top-8 h-1/3 bg-gradient-to-b from-slate-100 to-slate-50 border-2 border-b-0 border-slate-300 rounded-t-lg">
          {/* Window */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 rounded border-2 border-blue-300 bg-blue-100 shadow-inner" />

          {/* Wall label */}
          <div className="absolute top-2 left-4 text-xs font-medium text-slate-600">
            Back Wall
          </div>
        </div>

        {/* Left Wall */}
        <div className="absolute left-8 top-8 bottom-8 w-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded-l-lg border-l-2 border-y-2 border-slate-300" />

        {/* Right Wall */}
        <div className="absolute right-8 top-8 bottom-8 w-3 bg-gradient-to-l from-slate-200 to-slate-100 rounded-r-lg border-r-2 border-y-2 border-slate-300" />
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-slate-500">
        <div>
          <span className="font-medium">Room:</span> {room?.name || 'Unnamed'}
        </div>
        <div>
          <span className="font-medium">Items:</span> {placedAssets.length}
        </div>
      </div>

      {/* Empty State */}
      {placedAssets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white rounded-xl p-8 border border-slate-300 shadow-lg">
            <div className="text-6xl mb-2">📍</div>
            <p className="text-slate-700 font-semibold">No furniture placed</p>
            <p className="text-sm text-slate-500 mt-2">
              Select items from the library panel to place them
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
