'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Pointer,
  Move,
  RotateCw,
  Trash2,
  Ruler,
  Eye,
  Grid3x3,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import { Room3DPreview } from '@/components/common/Room3DPreview';
import { Room } from '@/lib/types';

interface EditorCanvasProps {
  room?: Room;
  selectedAssetId?: string;
  onToolSelect?: (tool: string) => void;
  activeTool?: string;
}

export function EditorCanvas({
  room,
  selectedAssetId,
  onToolSelect,
  activeTool = 'select',
}: EditorCanvasProps) {
  return (
    <div className="absolute left-72 top-14 right-80 bottom-0 flex flex-col bg-slate-50">
      {/* Toolbar */}
      <div className="border-b border-border bg-card p-2 flex items-center gap-2">
        <ButtonGroup>
          <Button
            variant={activeTool === 'select' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToolSelect?.('select')}
            title="Select"
            className="h-8 w-8 p-0"
          >
            <Pointer size={16} />
          </Button>
          <Button
            variant={activeTool === 'move' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToolSelect?.('move')}
            title="Move"
            className="h-8 w-8 p-0"
          >
            <Move size={16} />
          </Button>
          <Button
            variant={activeTool === 'rotate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToolSelect?.('rotate')}
            title="Rotate"
            className="h-8 w-8 p-0"
          >
            <RotateCw size={16} />
          </Button>
        </ButtonGroup>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onToolSelect?.('delete')}
          title="Delete"
          className="h-8 w-8 p-0"
        >
          <Trash2 size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onToolSelect?.('measure')}
          title="Measure"
          className="h-8 w-8 p-0"
        >
          <Ruler size={16} />
        </Button>

        <div className="flex-1" />

        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToolSelect?.('2d')}
            title="2D View"
            className="h-8 px-3"
          >
            <Grid3x3 size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToolSelect?.('3d')}
            title="3D View"
            className="h-8 px-3"
          >
            <Eye size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToolSelect?.('top')}
            title="Top View"
            className="h-8 px-3"
          >
            <Maximize2 size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToolSelect?.('reset')}
            title="Reset View"
            className="h-8 px-3"
          >
            <ZoomIn size={14} />
          </Button>
        </ButtonGroup>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto relative">
        <Room3DPreview
          room={room}
          selectedAssetId={selectedAssetId}
        />
      </div>
    </div>
  );
}
