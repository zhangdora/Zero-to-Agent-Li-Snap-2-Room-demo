'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Room } from '@/lib/types';

interface CreateRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (room: Room) => void;
}

export function CreateRoomModal({
  open,
  onOpenChange,
  onGenerate,
}: CreateRoomModalProps) {
  const [formData, setFormData] = useState({
    width: 4.2,
    depth: 3.6,
    height: 2.5,
    doorWidth: 0.8,
    doorHeight: 2.0,
    doorPosition: 'front' as const,
    budget: 800,
  });

  const handleGenerate = () => {
    const room: Room = {
      type: 'living-room',
      name: 'Living Room Adaptation Project',
      dimensions: {
        width: formData.width,
        depth: formData.depth,
        height: formData.height,
      },
      door: {
        width: formData.doorWidth,
        height: formData.doorHeight,
        position: formData.doorPosition,
      },
      budget: formData.budget,
      assets: [],
    };
    onGenerate(room);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Room Layout</DialogTitle>
          <DialogDescription>
            Define your room dimensions and budget
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Room Width (m)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                value={formData.width}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    width: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="depth">Room Depth (m)</Label>
              <Input
                id="depth"
                type="number"
                step="0.1"
                value={formData.depth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    depth: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="height">Room Height (m)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={formData.height}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  height: parseFloat(e.target.value),
                })
              }
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Door Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doorWidth">Door Width (m)</Label>
                <Input
                  id="doorWidth"
                  type="number"
                  step="0.1"
                  value={formData.doorWidth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doorWidth: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="doorHeight">Door Height (m)</Label>
                <Input
                  id="doorHeight"
                  type="number"
                  step="0.1"
                  value={formData.doorHeight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doorHeight: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="doorPosition">Door Position</Label>
              <Select
                value={formData.doorPosition}
                onValueChange={(value: any) =>
                  setFormData({
                    ...formData,
                    doorPosition: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="front">Front</SelectItem>
                  <SelectItem value="back">Back</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4">
            <Label htmlFor="budget">Budget (£)</Label>
            <Input
              id="budget"
              type="number"
              step="50"
              value={formData.budget}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleGenerate}>
            Generate Room Layout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
