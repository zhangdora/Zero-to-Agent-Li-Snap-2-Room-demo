"use client";

import { useWorkflow } from "@/lib/workflow-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DoorOpen, Ruler, PoundSterling } from "lucide-react";
import type { DoorPosition } from "@/lib/types";

export function CreateRoomStep() {
  const { state, dispatch } = useWorkflow();
  const { room } = state;

  const updateRoom = (updates: Parameters<typeof dispatch>[0] extends { type: "UPDATE_ROOM"; payload: infer P } ? P : never) => {
    dispatch({ type: "UPDATE_ROOM", payload: updates });
  };

  const handleNext = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-stone-900">Create Your Room</h2>
        <p className="text-stone-500 mt-1">
          Start with your real room constraints, not a generic design template.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Room Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Room Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-sm">Living Room</Badge>
            </CardContent>
          </Card>

          {/* Room Dimensions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Room Dimensions
              </CardTitle>
              <CardDescription>Enter your room measurements in meters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (m)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={room.dimensions.width}
                    onChange={(e) =>
                      updateRoom({
                        dimensions: { ...room.dimensions, width: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">Depth (m)</Label>
                  <Input
                    id="depth"
                    type="number"
                    step="0.1"
                    value={room.dimensions.depth}
                    onChange={(e) =>
                      updateRoom({
                        dimensions: { ...room.dimensions, depth: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={room.dimensions.height}
                    onChange={(e) =>
                      updateRoom({
                        dimensions: { ...room.dimensions, height: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Door Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DoorOpen className="w-4 h-4" />
                Door Settings
              </CardTitle>
              <CardDescription>Your doorway affects furniture fit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doorWidth">Width (m)</Label>
                  <Input
                    id="doorWidth"
                    type="number"
                    step="0.05"
                    value={room.door.width}
                    onChange={(e) =>
                      updateRoom({
                        door: { ...room.door, width: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doorHeight">Height (m)</Label>
                  <Input
                    id="doorHeight"
                    type="number"
                    step="0.05"
                    value={room.door.height}
                    onChange={(e) =>
                      updateRoom({
                        door: { ...room.door, height: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doorPosition">Position</Label>
                  <Select
                    value={room.door.position}
                    onValueChange={(value: DoorPosition) =>
                      updateRoom({ door: { ...room.door, position: value } })
                    }
                  >
                    <SelectTrigger id="doorPosition">
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
            </CardContent>
          </Card>

          {/* Budget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PoundSterling className="w-4 h-4" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-stone-500">£</span>
                <Input
                  type="number"
                  step="50"
                  value={room.budget}
                  onChange={(e) => updateRoom({ budget: parseInt(e.target.value) || 0 })}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Floor Plan & Summary */}
        <div className="space-y-6">
          {/* 2D Floor Plan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Floor Plan Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square max-w-[300px] mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Room outline */}
                  <rect
                    x="20"
                    y="20"
                    width="160"
                    height="160"
                    fill="none"
                    stroke="#d6d3d1"
                    strokeWidth="3"
                    className="fill-stone-50"
                  />
                  {/* Room fill */}
                  <rect
                    x="23"
                    y="23"
                    width="154"
                    height="154"
                    className="fill-amber-50"
                  />
                  {/* Door indicator based on position */}
                  {room.door.position === "front" && (
                    <rect x="80" y="17" width="40" height="6" className="fill-stone-400" />
                  )}
                  {room.door.position === "back" && (
                    <rect x="80" y="177" width="40" height="6" className="fill-stone-400" />
                  )}
                  {room.door.position === "left" && (
                    <rect x="17" y="80" width="6" height="40" className="fill-stone-400" />
                  )}
                  {room.door.position === "right" && (
                    <rect x="177" y="80" width="6" height="40" className="fill-stone-400" />
                  )}
                  {/* Dimension labels */}
                  <text x="100" y="12" textAnchor="middle" className="fill-stone-500 text-[10px]">
                    {room.dimensions.width}m
                  </text>
                  <text
                    x="8"
                    y="100"
                    textAnchor="middle"
                    className="fill-stone-500 text-[10px]"
                    transform="rotate(-90, 8, 100)"
                  >
                    {room.dimensions.depth}m
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Constraints Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Room Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Floor Area</span>
                  <span className="font-medium">
                    {(room.dimensions.width * room.dimensions.depth).toFixed(1)} m²
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Doorway Size</span>
                  <span className="font-medium">
                    {room.door.width}m × {room.door.height}m
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Max Budget</span>
                  <Badge variant="outline">£{room.budget}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doorway Check Info */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <p className="text-sm text-amber-800">
                <strong>Doorway Check:</strong> We&apos;ll ensure all furniture can fit through your{" "}
                {room.door.width}m wide doorway before you buy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext} size="lg" className="gap-2">
          Continue to Inspiration
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
