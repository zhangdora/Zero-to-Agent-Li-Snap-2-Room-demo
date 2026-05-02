"use client";

import { useWorkflow } from "@/lib/workflow-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductOptionCard } from "@/components/common/ProductOptionCard";
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  Sofa,
  Coffee,
  Lamp,
  Square,
  Tv,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sofa: Sofa,
  "coffee-table": Coffee,
  "floor-lamp": Lamp,
  rug: Square,
  "tv-stand": Tv,
};

export function BuyOptionsStep() {
  const { state, dispatch } = useWorkflow();
  const { assets, products, customQuotes } = state;

  const placedAssets = assets.filter((a) => a.placedInRoom);
  const orderedCount = products.filter((p) => p.inOrder).length;

  const handleAddToOrder = (productId: string) => {
    dispatch({ type: "ADD_TO_ORDER", payload: productId });
  };

  const handleRemoveFromOrder = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_ORDER", payload: productId });
  };

  const handleRequestQuote = (assetId: string) => {
    dispatch({ type: "REQUEST_CUSTOM_QUOTE", payload: assetId });
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
        <h2 className="text-2xl font-semibold text-stone-900">Buy or Customise</h2>
        <p className="text-stone-500 mt-1">Choose fewer, better-fit options.</p>
      </div>

      {/* Mock Shopping Banner */}
      <Card className="mb-6 bg-amber-50 border-amber-200">
        <CardContent className="py-3">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>Mock shopping data now.</strong> Bright Data integration comes in step #2.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {orderedCount} items in order
          </Badge>
        </div>
        <Button variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Show fewer, better options
        </Button>
      </div>

      {/* Products by Asset */}
      <div className="space-y-8">
        {placedAssets.map((asset) => {
          const assetProducts = products.filter((p) => p.assetId === asset.id);
          const customQuote = customQuotes.find((q) => q.assetId === asset.id);
          const hasProducts = assetProducts.length > 0;
          const Icon = CATEGORY_ICONS[asset.category] || Sofa;

          return (
            <div key={asset.id}>
              {/* Asset Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900">{asset.name}</h3>
                  <p className="text-sm text-stone-500">
                    Target size: {asset.adaptedSize.width} × {asset.adaptedSize.depth} cm
                  </p>
                </div>
              </div>

              {/* Product Options or No Results */}
              {hasProducts ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assetProducts.map((product) => (
                    <ProductOptionCard
                      key={product.id}
                      product={product}
                      onAddToOrder={() => handleAddToOrder(product.id)}
                      onRemoveFromOrder={() => handleRemoveFromOrder(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-amber-800">
                          No suitable product found
                        </h4>
                        <p className="text-sm text-amber-700 mt-1">
                          No product matched your target style and width under{" "}
                          {asset.adaptedSize.width} cm
                        </p>

                        {customQuote && (
                          <div className="mt-4 p-4 rounded-lg bg-white border border-amber-200">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium text-stone-900">
                                  Custom {asset.name}
                                </p>
                                <p className="text-sm text-stone-500 mt-1">
                                  Estimated price: {customQuote.estimatedPriceRange}
                                </p>
                                <p className="text-xs text-stone-400 mt-1">
                                  {customQuote.reason}
                                </p>
                              </div>
                              {customQuote.requested ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 border-green-200 text-green-700"
                                >
                                  Quote Requested
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="gap-1"
                                  onClick={() => handleRequestQuote(asset.id)}
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Request Quote
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
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
          disabled={orderedCount === 0}
        >
          Continue to Checkout
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {orderedCount === 0 && (
        <p className="mt-4 text-center text-sm text-stone-500">
          Add at least one item to your order to continue
        </p>
      )}
    </div>
  );
}
