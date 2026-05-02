"use client";

import { useWorkflow } from "@/lib/workflow-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AssetCard } from "@/components/common/AssetCard";
import { ArrowRight, ArrowLeft, Sparkles, Plus } from "lucide-react";

export function GeneratedAssetsStep() {
  const { state, dispatch } = useWorkflow();
  const { assets } = state;

  const allInLibrary = assets.every((a) => a.inLibrary);

  const handleAddToLibrary = (assetId: string) => {
    dispatch({ type: "ADD_TO_LIBRARY", payload: assetId });
  };

  const handleAddAllToLibrary = () => {
    dispatch({ type: "ADD_ALL_TO_LIBRARY" });
  };

  const handleNext = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-stone-900">Generated Furniture Assets</h2>
        <p className="text-stone-500 mt-1">
          We turn inspiration into editable furniture assets.
        </p>
      </div>

      {/* Philosophy Card */}
      <Card className="mb-6 bg-gradient-to-r from-stone-900 to-stone-800 text-white">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium">5 assets extracted from your inspiration</p>
              <p className="text-sm text-stone-300">
                Each asset has been adapted to fit your {state.room.dimensions.width}m × {state.room.dimensions.depth}m room
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add All CTA */}
      {!allInLibrary && (
        <div className="mb-6 flex justify-end">
          <Button onClick={handleAddAllToLibrary} className="gap-2">
            <Plus className="w-4 h-4" />
            Add all adapted assets to My Room Library
          </Button>
        </div>
      )}

      {/* Assets Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onAddToLibrary={() => handleAddToLibrary(asset.id)}
            showActions={true}
          />
        ))}
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
          disabled={!allInLibrary}
        >
          Continue to My Room Library
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {!allInLibrary && (
        <p className="mt-4 text-center text-sm text-stone-500">
          Add all assets to your library to continue
        </p>
      )}
    </div>
  );
}
