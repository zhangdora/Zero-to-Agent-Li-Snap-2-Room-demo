"use client";

import type { Asset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, Trash2, Plus, DoorOpen, Sofa, Lamp, Square, Tv, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sofa: Sofa,
  "coffee-table": Coffee,
  "floor-lamp": Lamp,
  rug: Square,
  "tv-stand": Tv,
};

const CATEGORY_COLORS: Record<string, string> = {
  sofa: "bg-amber-100 text-amber-700",
  "coffee-table": "bg-orange-100 text-orange-700",
  "floor-lamp": "bg-yellow-100 text-yellow-700",
  rug: "bg-stone-100 text-stone-700",
  "tv-stand": "bg-emerald-100 text-emerald-700",
};

interface AssetCardProps {
  asset: Asset;
  onAddToLibrary?: () => void;
  onRemove?: () => void;
  onEdit?: () => void;
  onPlaceInRoom?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function AssetCard({
  asset,
  onAddToLibrary,
  onRemove,
  onEdit,
  onPlaceInRoom,
  showActions = true,
  compact = false,
}: AssetCardProps) {
  const Icon = CATEGORY_ICONS[asset.category] || Sofa;
  const colorClass = CATEGORY_COLORS[asset.category] || "bg-stone-100 text-stone-700";

  if (compact) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{asset.name}</p>
              <p className="text-xs text-stone-500">
                {asset.adaptedSize.width} × {asset.adaptedSize.depth} cm
              </p>
            </div>
            {onPlaceInRoom && !asset.placedInRoom && (
              <Button size="sm" variant="outline" onClick={onPlaceInRoom}>
                Place
              </Button>
            )}
            {asset.placedInRoom && (
              <Badge variant="secondary" className="text-xs">
                <Check className="w-3 h-3 mr-1" />
                Placed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Asset Visual */}
      <div className={cn("h-32 flex items-center justify-center", colorClass.replace("text-", "bg-").replace("-700", "-50"))}>
        <Icon className={cn("w-16 h-16", colorClass.replace("bg-", "text-").replace("-100", "-400"))} />
      </div>

      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-stone-900">{asset.name}</h4>
            <p className="text-sm text-stone-500 capitalize">{asset.category.replace("-", " ")}</p>
          </div>
          <div className="flex gap-1">
            <Badge
              variant={asset.fitStatus === "good" ? "default" : "secondary"}
              className={cn(
                "text-xs",
                asset.fitStatus === "good" && "bg-green-100 text-green-700 hover:bg-green-100"
              )}
            >
              {asset.fitStatus === "good" ? "Good fit" : asset.fitStatus}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-stone-500">Original size</span>
            <span className="text-stone-400 line-through">
              {asset.originalSize.width} × {asset.originalSize.depth} × {asset.originalSize.height} cm
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Adapted size</span>
            <span className="font-medium">
              {asset.adaptedSize.width} × {asset.adaptedSize.depth} × {asset.adaptedSize.height} cm
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Colour</span>
            <span className="capitalize">{asset.color}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Material</span>
            <span className="capitalize">{asset.material}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Style</span>
            <span className="capitalize">{asset.style}</span>
          </div>
        </div>

        {/* Doorway Badge */}
        <div className="flex items-center gap-2 mb-4">
          <DoorOpen className="w-4 h-4 text-stone-400" />
          <Badge
            variant="outline"
            className={cn(
              asset.doorwayStatus === "passed" && "border-green-300 bg-green-50 text-green-700",
              asset.doorwayStatus === "caution" && "border-amber-300 bg-amber-50 text-amber-700",
              asset.doorwayStatus === "failed" && "border-red-300 bg-red-50 text-red-700"
            )}
          >
            Doorway: {asset.doorwayStatus}
          </Badge>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {onAddToLibrary && !asset.inLibrary && (
              <Button size="sm" className="flex-1 gap-1" onClick={onAddToLibrary}>
                <Plus className="w-3 h-3" />
                Add to Library
              </Button>
            )}
            {asset.inLibrary && (
              <Badge variant="secondary" className="flex-1 justify-center py-2">
                <Check className="w-3 h-3 mr-1" />
                In Library
              </Badge>
            )}
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Pencil className="w-3 h-3" />
              </Button>
            )}
            {onRemove && (
              <Button size="sm" variant="outline" onClick={onRemove}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
