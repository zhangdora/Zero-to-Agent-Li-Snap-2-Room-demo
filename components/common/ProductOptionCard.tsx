"use client";

import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, DoorOpen, ShoppingCart, Store, Star, Zap, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const MATCH_TYPE_CONFIG = {
  closest: {
    label: "Closest Match",
    icon: Star,
    color: "bg-amber-50 border-amber-200 text-amber-700",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  budget: {
    label: "Best Budget",
    icon: Zap,
    color: "bg-green-50 border-green-200 text-green-700",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
  },
  "best-fit": {
    label: "Best Fit",
    icon: LayoutGrid,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
};

interface ProductOptionCardProps {
  product: Product;
  onAddToOrder: () => void;
  onRemoveFromOrder: () => void;
}

export function ProductOptionCard({
  product,
  onAddToOrder,
  onRemoveFromOrder,
}: ProductOptionCardProps) {
  const config = MATCH_TYPE_CONFIG[product.matchType];
  const MatchIcon = config.icon;

  return (
    <Card className={cn("overflow-hidden", product.inOrder && "ring-2 ring-stone-900")}>
      {/* Match Type Header */}
      <div className={cn("px-4 py-2 flex items-center gap-2", config.color)}>
        <MatchIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>

      <CardContent className="p-4">
        {/* Product Info */}
        <div className="mb-3">
          <h4 className="font-medium text-stone-900">{product.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Store className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-sm text-stone-500">{product.retailer}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-semibold text-stone-900">£{product.price}</span>
        </div>

        {/* Dimensions */}
        <div className="text-sm text-stone-500 mb-3">
          {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} cm
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            variant="outline"
            className={cn(
              product.fitStatus === "good"
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-amber-300 bg-amber-50 text-amber-700"
            )}
          >
            <Check className="w-3 h-3 mr-1" />
            {product.fitStatus === "good" ? "Good fit" : "Tight fit"}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              product.doorwayStatus === "passed"
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-red-300 bg-red-50 text-red-700"
            )}
          >
            <DoorOpen className="w-3 h-3 mr-1" />
            Doorway: {product.doorwayStatus}
          </Badge>
        </div>

        {/* Match Reason */}
        <p className="text-xs text-stone-500 mb-4 leading-relaxed">
          {product.matchReason}
        </p>

        {/* Action Button */}
        {product.inOrder ? (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onRemoveFromOrder}
          >
            <Check className="w-4 h-4" />
            Added to Order
          </Button>
        ) : (
          <Button className="w-full gap-2" onClick={onAddToOrder}>
            <ShoppingCart className="w-4 h-4" />
            Add to Order
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
