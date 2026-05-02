"use client";

import { useWorkflow } from "@/lib/workflow-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Check,
  DoorOpen,
  LayoutGrid,
  Truck,
  Download,
  Save,
  ShoppingBag,
  MessageSquare,
  PartyPopper,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckoutStep() {
  const { state, dispatch } = useWorkflow();
  const { products, customQuotes, orderPlaced, room } = state;

  const orderedProducts = products.filter((p) => p.inOrder);
  const requestedQuotes = customQuotes.filter((q) => q.requested);
  const totalCost = orderedProducts.reduce((sum, p) => sum + p.price, 0);
  const allDoorwayPassed = orderedProducts.every((p) => p.doorwayStatus === "passed");
  const allFitGood = orderedProducts.every((p) => p.fitStatus === "good");

  const handlePlaceOrder = () => {
    dispatch({ type: "PLACE_ORDER" });
  };

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-green-100 flex items-center justify-center mb-6">
          <PartyPopper className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">
          Your room plan is ready!
        </h2>
        <p className="text-stone-500 mb-8">
          Your selected items have been saved to My Room Library.
        </p>

        <Card className="mb-8 bg-stone-900 text-white">
          <CardContent className="py-6">
            <p className="text-lg font-medium text-center">
              &ldquo;Because the sofa should fit your doorway before it reaches your doorway.&rdquo;
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2" onClick={handleReset}>
            <Home className="w-4 h-4" />
            Start New Room
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export Shopping List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-stone-900">Checkout</h2>
        <p className="text-stone-500 mt-1">
          Buy with confidence before anything arrives at your door.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Selected Products ({orderedProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderedProducts.map((product, index) => (
                <div key={product.id}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-stone-900">{product.name}</p>
                      <p className="text-sm text-stone-500">{product.retailer}</p>
                      <p className="text-xs text-stone-400 mt-1">
                        {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} cm
                      </p>
                    </div>
                    <p className="font-semibold text-stone-900">£{product.price}</p>
                  </div>
                </div>
              ))}

              {orderedProducts.length === 0 && (
                <p className="text-center text-stone-400 py-4">No products selected</p>
              )}
            </CardContent>
          </Card>

          {/* Custom Quotes */}
          {requestedQuotes.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                  <MessageSquare className="w-4 h-4" />
                  Custom Quote Requests ({requestedQuotes.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requestedQuotes.map((quote) => (
                  <div key={quote.assetId} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-amber-800">{quote.assetName}</p>
                      <p className="text-sm text-amber-700">{quote.reason}</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-700">
                      {quote.estimatedPriceRange}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Delivery Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Delivery Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  All items checked against your {room.door.width}m doorway
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Room dimensions verified: {room.dimensions.width}m × {room.dimensions.depth}m
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Items will be delivered separately by each retailer
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary & CTA */}
        <div className="space-y-6">
          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Products ({orderedProducts.length})</span>
                <span>£{totalCost}</span>
              </div>
              {requestedQuotes.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Custom quotes</span>
                  <span className="text-stone-400">TBD</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Estimated Total</span>
                <span className="text-lg">£{totalCost}</span>
              </div>
            </CardContent>
          </Card>

          {/* Fit Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Fit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-stone-400" />
                  <span className="text-sm">Doorway check</span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    allDoorwayPassed
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  )}
                >
                  {allDoorwayPassed ? "All passed" : "Issues found"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-stone-400" />
                  <span className="text-sm">Room fit</span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    allFitGood
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  )}
                >
                  {allFitGood ? "Good" : "Tight"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={orderedProducts.length === 0}
            >
              <ShoppingBag className="w-4 h-4" />
              Place Mock Order
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Save className="w-4 h-4" />
              Save Plan
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Export Shopping List
            </Button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
