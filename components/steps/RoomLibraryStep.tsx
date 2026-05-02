"use client";

import { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetCard } from "@/components/common/AssetCard";
import { Room3DPreview } from "@/components/common/Room3DPreview";
import { ArrowRight, ArrowLeft, Library, Trash2, RefreshCw, ShoppingBag, DoorOpen, Check, X } from "lucide-react";
import type { Asset } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RoomLibraryStep() {
  const { state, dispatch } = useWorkflow();
  const { library, assets } = state;
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const allPlaced = library.every((a) => a.placedInRoom);

  const handlePlaceInRoom = (assetId: string) => {
    dispatch({ type: "PLACE_IN_ROOM", payload: assetId });
  };

  const handlePlaceAll = () => {
    library.forEach((asset) => {
      if (!asset.placedInRoom) {
        dispatch({ type: "PLACE_IN_ROOM", payload: asset.id });
      }
    });
  };

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
        <h2 className="text-2xl font-semibold text-stone-900">My Room Library</h2>
        <p className="text-stone-500 mt-1">
          Your library starts empty and grows from what you love.
        </p>
      </div>

      {/* Philosophy Note */}
      <Card className="mb-6 bg-amber-50 border-amber-200">
        <CardContent className="py-3">
          <p className="text-sm text-amber-800">
            <strong>Traditional design tools</strong> start from a public model library.{" "}
            <strong>Snap2Room</strong> starts from an empty personal library built from what you love.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Panel: Library Assets */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-stone-900 flex items-center gap-2">
              <Library className="w-4 h-4" />
              My Library ({library.length})
            </h3>
            {library.length > 0 && !allPlaced && (
              <Button size="sm" variant="outline" onClick={handlePlaceAll}>
                Place All
              </Button>
            )}
          </div>

          {library.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Library className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p className="text-sm text-stone-500">Your library is empty</p>
                <p className="text-xs text-stone-400 mt-1">
                  Add furniture from your inspiration image
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {library.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  compact
                  onPlaceInRoom={() => handlePlaceInRoom(asset.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Center Panel: 3D Preview */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Room Preview</CardTitle>
              <CardDescription>
                Click on furniture to see details
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

        {/* Right Panel: Selected Asset Details */}
        <div className="lg:col-span-3">
          <Card className={cn(!selectedAsset && "border-dashed")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAsset ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-stone-900">{selectedAsset.name}</h4>
                    <p className="text-sm text-stone-500 capitalize">
                      {selectedAsset.category.replace("-", " ")}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Adapted size</span>
                      <span className="font-medium">
                        {selectedAsset.adaptedSize.width} × {selectedAsset.adaptedSize.depth} cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Source</span>
                      <span>{selectedAsset.source}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "flex-1 justify-center",
                          selectedAsset.fitStatus === "good"
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-amber-300 bg-amber-50 text-amber-700"
                        )}
                      >
                        {selectedAsset.fitStatus === "good" ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        Fit: {selectedAsset.fitStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "flex-1 justify-center",
                          selectedAsset.doorwayStatus === "passed"
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-red-300 bg-red-50 text-red-700"
                        )}
                      >
                        <DoorOpen className="w-3 h-3 mr-1" />
                        Doorway: {selectedAsset.doorwayStatus}
                      </Badge>
                    </div>
                  </div>

                  {selectedAsset.lowestPrice && (
                    <div className="pt-2 border-t border-stone-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Lowest price from</span>
                        <span className="font-medium text-green-600">£{selectedAsset.lowestPrice}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleRemoveFromRoom(selectedAsset.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove from Room
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Replace
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      Find Purchase Options
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-stone-400">
                    Select an item in the preview to see details
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
        <Button
          onClick={handleNext}
          size="lg"
          className="gap-2"
          disabled={!allPlaced || library.length === 0}
        >
          Continue to Preview
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {library.length > 0 && !allPlaced && (
        <p className="mt-4 text-center text-sm text-stone-500">
          Place all items in your room to continue
        </p>
      )}
    </div>
  );
}
