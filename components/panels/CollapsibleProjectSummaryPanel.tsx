'use client';

import { Button } from '@/components/ui/button';
import type { Asset, Room } from '@/lib/types';
import { ProjectSummaryCard } from '@/components/panels/RoomSummaryCard';
import { cn } from '@/lib/utils';

interface CollapsibleProjectSummaryPanelProps {
  room?: Room;
  placedAssets?: Asset[];
  projectName?: string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function CollapsibleProjectSummaryPanel({
  room,
  placedAssets = [],
  projectName = 'My Project',
  isOpen,
  onToggle,
}: CollapsibleProjectSummaryPanelProps) {
  if (!room) {
    return null;
  }

  return (
    <>
      {/* Expanded Panel */}
      <div
        className={cn(
          'w-80 bg-card border-l border-border h-full flex flex-col p-4 overflow-y-auto transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Project Summary</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggle(false)}
            className="h-6 w-6 p-0 hover:bg-muted"
            title="Collapse Project Summary"
          >
            <span className="text-sm font-semibold">&gt;&gt;</span>
          </Button>
        </div>

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

      {/* Collapsed Tab */}
      <div
        className={cn(
          'bg-card border-l border-border h-full w-12 flex items-center justify-center transition-all duration-300 ease-in-out',
          !isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onToggle(true)}
          className="h-full w-full p-0 rounded-none hover:bg-muted flex items-center justify-center"
          title="Expand Project Summary"
        >
          <span className="text-sm font-semibold text-muted-foreground hover:text-foreground">&lt;&lt;</span>
        </Button>
      </div>
    </>
  );
}
