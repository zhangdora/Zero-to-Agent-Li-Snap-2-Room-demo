'use client';

import { Card } from '@/components/ui/card';
import type { Asset } from '@/lib/types';

interface ProjectSummaryCardProps {
  projectName?: string;
  roomType?: string;
  width?: number;
  depth?: number;
  height?: number;
  doorWidth?: number;
  doorHeight?: number;
  doorPosition?: string;
  budget?: number;
  placedAssets?: Asset[];
  defaultExpanded?: boolean;
}

export function ProjectSummaryCard({
  projectName = 'My New Project',
  roomType = 'Living Room',
  width = 4.2,
  depth = 3.6,
  height = 2.8,
  doorWidth = 0.8,
  doorHeight = 2.1,
  doorPosition = 'left',
  budget = 800,
  placedAssets = [],
}: ProjectSummaryCardProps) {
  return (
    <Card className="p-4 overflow-hidden">
      {/* Project name */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground">Project Name</p>
        <p className="font-medium text-sm">{projectName}</p>
      </div>

      {/* Basic info grid */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Room Type</p>
          <p className="font-medium">{roomType}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="font-medium">£{budget}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Width</p>
          <p className="font-medium">{width}m</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Depth</p>
          <p className="font-medium">{depth}m</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Height</p>
          <p className="font-medium">{height}m</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Items Placed</p>
          <p className="font-medium">{placedAssets.length}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Door Width</p>
          <p className="font-medium">{doorWidth}m</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Door Height</p>
          <p className="font-medium">{doorHeight}m</p>
        </div>
      </div>

      {/* Door position */}
      <div className="text-xs text-muted-foreground border-t border-border pt-3 mb-3">
        <p>Door position: <span className="font-medium text-foreground capitalize">{doorPosition}</span></p>
      </div>

      {/* Furniture list */}
      {placedAssets.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Furniture ({placedAssets.length})</p>
          <ul className="space-y-1">
            {placedAssets.map((asset) => (
              <li key={asset.id} className="text-xs text-foreground">
                <span className="font-medium">{asset.name}</span>
                {asset.colour && <span className="text-muted-foreground"> • {asset.colour}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
