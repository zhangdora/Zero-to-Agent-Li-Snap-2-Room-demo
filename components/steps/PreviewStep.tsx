"use client";

import { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Room3DPreview } from "@/components/common/Room3DPreview";
import {
  ArrowRight,
  ArrowLeft,
  DoorOpen,
  PoundSterling,
  Sparkles,
  LayoutGrid,
  Trash2,
  RefreshCw,
  Minimize2,
  TrendingDown,
  Palette,
} from "lucide-react";
import type { Asset } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PreviewStep() {
  const { state, dispatch } = useWorkflow();
  const { assets, library, room } = state;
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const placedAssets = assets.filter((a) => a.placedInRoom);
  const estimatedTotal = placedAssets.reduce((sum, a) => sum + (a.lowestPrice || 0), 0);
  const allDoorwayPassed = placedAssets.every((a) => a.doorwayStatus === "passed");
  const allFitGood = placedAssets.every((a) => a.fitStatus === "good");

  const handleRemoveFromRoom = (assetId: string) => {
    dispatch({ type: "REMOVE_FROM_ROOM", payload: assetId });
    if (selectedAsset?.id === assetId) {
      setSelectedAsset(null);
    }
  };

  const handleNext = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-stone-900">Preview & Fine-tune</h2>
        <p className="text-stone-500 mt-1">
          Not endless choices. Just better-fit versions of what you already like.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className={cn(allDoorwayPassed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", allDoorwayPassed ? "bg-green-100" : "bg-red-100")}>
                <DoorOpen className={cn("w-5 h-5", allDoorwayPassed ? "text-green-600" : "text-red-600")} />
              </div>
              <div>
                <p className="text-sm text-stone-500">All items fit doorway</p>
                <p className={cn("font-semibold", allDoorwayPassed ? "text-green-700" : "text-red-700")}>
                  {allDoorwayPassed ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-stone-50 border-stone-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                <PoundSterling className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Estimated total</p>
                <p className="font-semibold text-stone-900">£{estimatedTotal}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Style match</p>
                <p className="font-semibold text-amber-700">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(allFitGood ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200")}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", allFitGood ? "bg-green-100" : "bg-amber-100")}>
                <LayoutGrid className={cn("w-5 h-5", allFitGood ? "text-green-600" : "text-amber-600")} />
              </div>
              <div>
                <p className="text-sm text-stone-500">Space fit</p>
                <p className={cn("font-semibold", allFitGood ? "text-green-700" : "text-amber-700")}>
                  {allFitGood ? "Good" : "Tight"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Room Preview */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Room Preview</CardTitle>
              <CardDescription>
                Your {room.dimensions.width}m × {room.dimensions.depth}m living room
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Room3DPreview
                assets={assets}
                selectedAssetId={selectedAsset?.id}
                onSelectAsset={setSelectedAsset}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Fine-tune Options */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-stone-900 text-white">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Snap2Room shows fewer, better-fit options instead of endless search results.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Fine-tune Your Selection</CardTitle>
              <CardDescription>
                {selectedAsset ? `Editing: ${selectedAsset.name}` : "Select an item to fine-tune"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAsset ? (
                <div className="space-y-4">
                  {/* Asset Info */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50">
                    <div className="flex-1">
                      <p className="font-medium text-stone-900">{selectedAsset.name}</p>
                      <p className="text-sm text-stone-500">
                        {selectedAsset.adaptedSize.width} × {selectedAsset.adaptedSize.depth} cm
                      </p>
                    </div>
                    {selectedAsset.lowestPrice && (
                      <Badge variant="secondary">From £{selectedAsset.lowestPrice}</Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid gap-2">
                    <Button variant="outline" className="justify-start gap-2" onClick={() => handleRemoveFromRoom(selectedAsset.id)}>
                      <Trash2 className="w-4 h-4" />
                      Remove item
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Replace item
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <Minimize2 className="w-4 h-4" />
                      Make smaller
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Make cheaper
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <Palette className="w-4 h-4" />
                      Keep style
                    </Button>
                  </div>

                  {/* Curated Options */}
                  <div className="pt-4 border-t border-stone-100">
                    <p className="text-sm font-medium text-stone-700 mb-3">Curated Options</p>
                    <div className="grid gap-2">
                      <button className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors text-left">
                        <div>
                          <p className="font-medium text-sm">Closest Match</p>
                          <p className="text-xs text-stone-500">Best visual match</p>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                          £{(selectedAsset.lowestPrice || 100) + 100}
                        </Badge>
                      </button>
                      <button className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left">
                        <div>
                          <p className="font-medium text-sm text-green-800">Best Budget</p>
                          <p className="text-xs text-green-600">Lowest price option</p>
                        </div>
                        <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700">
                          £{selectedAsset.lowestPrice || 100}
                        </Badge>
                      </button>
                      <button className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors text-left">
                        <div>
                          <p className="font-medium text-sm">Best Fit</p>
                          <p className="text-xs text-stone-500">Optimized for your room</p>
                        </div>
                        <Badge variant="outline" className="bg-stone-50 border-stone-200 text-stone-700">
                          £{(selectedAsset.lowestPrice || 100) + 50}
                        </Badge>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-stone-400">
                    Click on furniture in the preview to fine-tune
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleNext} size="lg" className="gap-2">
          Continue to Buy Options
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
