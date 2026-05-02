'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import type { Asset, Room } from '@/lib/types';
import {
  getMockProductOptionsForAsset,
  sortProductOptionsForPriorities,
  type FurniturePurchaseGroup,
  type ProductOption,
} from '@/lib/mock-purchase-data';
import { cn } from '@/lib/utils';
import { FurniturePhotoThumbnail } from '@/components/ui/furniture-photo-thumbnail';

interface ShoppingListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placedAssets: Asset[];
  room?: Room | null;
  roomBudget?: number;
}

const STEPS = ['Review Furniture', 'Set Priorities', 'Search Web', 'Review Links', 'Confirm Purchase'];

const PRIORITY_OPTIONS = [
  'Price',
  'Size fit',
  'Delivery cost',
  'Style match',
  'Doorway fit',
  'Retailer reliability',
];

const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  Amazon: { bg: 'bg-yellow-50', text: 'text-yellow-900' },
  Taobao: { bg: 'bg-orange-50', text: 'text-orange-900' },
  Temu: { bg: 'bg-red-50', text: 'text-red-900' },
  IKEA: { bg: 'bg-blue-50', text: 'text-blue-900' },
  Argos: { bg: 'bg-gray-50', text: 'text-gray-900' },
  'John Lewis': { bg: 'bg-blue-50', text: 'text-blue-900' },
  Wayfair: { bg: 'bg-purple-50', text: 'text-purple-900' },
  Dunelm: { bg: 'bg-gray-50', text: 'text-gray-900' },
  'Bright Data': { bg: 'bg-emerald-50', text: 'text-emerald-900' },
  'Web result': { bg: 'bg-slate-50', text: 'text-slate-900' },
};

type SearchProductsResponse = {
  source: 'bright_data' | 'mock';
  query: string;
  products: ProductOption[];
  error?: string;
};

function formatDimensions(dimensions?: ProductOption['dimensions']) {
  if (!dimensions) return 'Size not listed';
  return `${dimensions.width} × ${dimensions.depth}${dimensions.height ? ` × ${dimensions.height}` : ''} ${dimensions.unit}`;
}

function getOptionTypeLabel(type: ProductOption['type']) {
  if (type === 'best_budget') return 'Best Budget';
  if (type === 'best_fit') return 'Best Fit';
  if (type === 'closest_match') return 'Closest Match';
  return 'Custom';
}

function getDefaultOptionType(priority: string) {
  return priority === 'Price' ? 'best_budget' : priority === 'Size fit' ? 'best_fit' : 'closest_match';
}

function getLocalFallbackGroup(asset: Asset, priorities: string[]): FurniturePurchaseGroup {
  return {
    asset,
    options: sortProductOptionsForPriorities(getMockProductOptionsForAsset(asset), asset, priorities),
  };
}

export function ShoppingListModal({
  open,
  onOpenChange,
  placedAssets,
  room,
  roomBudget = 800,
}: ShoppingListModalProps) {
  const [step, setStep] = useState(0);
  const [shoppingSelectedAssetIds, setShoppingSelectedAssetIds] = useState<Set<string>>(
    new Set(placedAssets.map((a) => a.id))
  );
  const [priorities, setPriorities] = useState(PRIORITY_OPTIONS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [purchaseOptions, setPurchaseOptions] = useState<FurniturePurchaseGroup[]>([]);
  const [productSources, setProductSources] = useState<Record<string, 'bright_data' | 'mock'>>({});
  const [searchLogs, setSearchLogs] = useState<string[]>([]);
  const [selectedPurchaseOptions, setSelectedPurchaseOptions] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  // Search public product data for selected furniture only.
  useEffect(() => {
    if (step === 2 && searching) {
      let cancelled = false;

      const progressInterval = setInterval(() => {
        setSearchProgress((p) => (p < 92 ? Math.min(92, p + Math.random() * 18) : p));
      }, 200);

      const selectedAssets = placedAssets.filter((asset) => shoppingSelectedAssetIds.has(asset.id));
      setSearchLogs([
        'Searching public web product data',
        `Preparing ${selectedAssets.length} furniture search ${selectedAssets.length === 1 ? 'query' : 'queries'}`,
      ]);

      const runSearch = async () => {
        const results = await Promise.allSettled(
          selectedAssets.map(async (asset) => {
            const response = await fetch('/api/search-products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                asset,
                room: room ?? null,
                priorities,
              }),
            });

            if (!response.ok) {
              throw new Error(`Product search failed for ${asset.name}`);
            }

            const data = (await response.json()) as SearchProductsResponse;
            if (!data.products?.length) {
              throw new Error(`No products found for ${asset.name}`);
            }

            return { asset, data };
          })
        );

        if (cancelled) return;

        const groupedOptions: FurniturePurchaseGroup[] = [];
        const sourceByAsset: Record<string, 'bright_data' | 'mock'> = {};
        const logs = ['Searching public web product data'];

        results.forEach((result, index) => {
          const asset = selectedAssets[index];
          if (result.status === 'fulfilled') {
            groupedOptions.push({
              asset: result.value.asset,
              options: result.value.data.products,
            });
            sourceByAsset[asset.id] = result.value.data.source;
            logs.push(
              result.value.data.source === 'bright_data'
                ? `Found live products for ${asset.name}`
                : `Using mock fallback for ${asset.name}`
            );
            if (result.value.data.error?.includes('API key is not configured')) {
              logs.push('Using mock fallback because Bright Data API key is not configured.');
            }
          } else {
            groupedOptions.push(getLocalFallbackGroup(asset, priorities));
            sourceByAsset[asset.id] = 'mock';
            logs.push(`Using mock fallback for ${asset.name}`);
          }
        });

        clearInterval(progressInterval);
        setSearchProgress(100);
        setPurchaseOptions(groupedOptions);
        setProductSources(sourceByAsset);
        setSearchLogs(Array.from(new Set(logs)));
        setSearching(false);

        const defaults: Record<string, string> = {};
        groupedOptions.forEach((group) => {
          const defaultType = getDefaultOptionType(priorities[0]);
          const option = group.options.find((item) => item.type === defaultType) || group.options[0];
          if (option) defaults[group.asset.id] = option.id;
        });
        setSelectedPurchaseOptions(defaults);
      };

      runSearch();

      return () => {
        cancelled = true;
        clearInterval(progressInterval);
      };
    }
  }, [step, searching, placedAssets, shoppingSelectedAssetIds, priorities, room]);

  const handleNext = () => {
    if (step === 0 && shoppingSelectedAssetIds.size === 0) {
      return; // Disabled state
    }
    if (step === 1) {
      // Moving from priorities to search - start searching
      setSearching(true);
      setSearchProgress(0);
      setPurchaseOptions([]);
      setProductSources({});
      setSearchLogs([]);
      setStep(step + 1);
      return;
    }
    if (step === 2) {
      // On search step, only proceed if search is complete
      if (!searching && purchaseOptions.length > 0) {
        setStep(step + 1);
      }
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePriorityDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handlePriorityDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handlePriorityDrop = (targetIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      const newPriorities = [...priorities];
      const draggedPriority = newPriorities[draggedIndex];
      newPriorities.splice(draggedIndex, 1);
      newPriorities.splice(targetIndex, 0, draggedPriority);
      setPriorities(newPriorities);
    }
    setDraggedIndex(null);
  };

  const handlePriorityDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setSearching(false);
    }
  };

  const toggleShoppingAsset = (assetId: string) => {
    const newSet = new Set(shoppingSelectedAssetIds);
    if (newSet.has(assetId)) {
      newSet.delete(assetId);
    } else {
      newSet.add(assetId);
    }
    setShoppingSelectedAssetIds(newSet);
  };

  const selectAllShoppingAssets = () => {
    setShoppingSelectedAssetIds(new Set(placedAssets.map((a) => a.id)));
  };

  const clearAllShoppingAssets = () => {
    setShoppingSelectedAssetIds(new Set());
  };

  const getTotal = () => {
    let subtotal = 0;
    let delivery = 0;

    const selectedAssets = Array.from(shoppingSelectedAssetIds);
    purchaseOptions.forEach((group) => {
      if (selectedAssets.includes(group.asset.id)) {
        const selectedId = selectedPurchaseOptions[group.asset.id];
        const option = group.options.find((o) => o.id === selectedId);
        if (option) {
          subtotal += option.price;
          delivery += option.delivery;
        }
      }
    });

    return { subtotal, delivery, total: subtotal + delivery };
  };

  const handleBuyNow = () => {
    setConfirmed(true);
  };

  const handleOpenAllLinks = () => {
    const selectedAssets = Array.from(shoppingSelectedAssetIds);
    purchaseOptions.forEach((group) => {
      if (selectedAssets.includes(group.asset.id)) {
        const selectedId = selectedPurchaseOptions[group.asset.id];
        const option = group.options.find((o) => o.id === selectedId);
        if (option && option.url) {
          window.open(option.url, '_blank', 'noopener,noreferrer');
        }
      }
    });
  };

  const currentStep = STEPS[step];
  const { subtotal, delivery, total } = getTotal();
  const budgetStatus = total <= roomBudget ? 'within' : 'over';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Shopping List</DialogTitle>
          <div className="flex gap-2 mt-4">
            {STEPS.map((s, idx) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                    step >= idx
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {idx + 1}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-12 h-1 mx-1',
                      step > idx ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <Separator />

        {/* Step 1: Review Furniture */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Select Furniture to Purchase</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {shoppingSelectedAssetIds.size} of {placedAssets.length} furniture items selected
              </p>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={selectAllShoppingAssets}
              >
                Select All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearAllShoppingAssets}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {placedAssets.map((asset) => {
                const isSelected = shoppingSelectedAssetIds.has(asset.id);
                return (
                  <Card
                    key={asset.id}
                    className={cn(
                      'p-3 cursor-pointer transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-muted bg-muted/30 opacity-60'
                    )}
                    onClick={() => toggleShoppingAsset(asset.id)}
                  >
                    <div className="flex gap-3 items-start">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleShoppingAsset(asset.id)}
                        className="mt-1"
                      />
                      <div className="w-20 h-20 flex-shrink-0 bg-white rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
                        <FurniturePhotoThumbnail category={asset.category} size="md" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{asset.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 grid grid-cols-2 gap-2">
                          <div>Category: {asset.category}</div>
                          {asset.adaptedSize && (
                            <div>
                              Size: {asset.adaptedSize.width}×{asset.adaptedSize.depth}cm
                            </div>
                          )}
                          {asset.material && <div>Material: {asset.material}</div>}
                          {((asset as Asset & { colour?: string }).colour || asset.color) && (
                            <div>Colour: {(asset as Asset & { colour?: string }).colour || asset.color}</div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Badge className="bg-primary">Selected</Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Set Priorities */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4">Rank Your Priorities</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag to reorder. Top priority will be used to select default products.
              </p>
            </div>

            <div className="space-y-2">
              {priorities.map((priority, idx) => (
                <div
                  key={priority}
                  draggable
                  onDragStart={() => handlePriorityDragStart(idx)}
                  onDragOver={handlePriorityDragOver}
                  onDrop={() => handlePriorityDrop(idx)}
                  onDragEnd={handlePriorityDragEnd}
                  className={cn(
                    'flex items-center gap-3 p-3 border rounded-lg bg-muted/50 cursor-move transition-all',
                    draggedIndex === idx && 'opacity-50 bg-primary/10'
                  )}
                >
                  <div className="text-muted-foreground text-xs">⋮⋮</div>
                  <div className="font-semibold text-sm w-6 text-primary">{idx + 1}</div>
                  <div className="flex-1 font-medium">{priority}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                Searching purchase links for {shoppingSelectedAssetIds.size} selected furniture items.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Search Web */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Searching for Purchase Options</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Searching public web product data for {shoppingSelectedAssetIds.size} selected furniture items.
              </p>
            </div>

            {searching ? (
              <div className="space-y-4">
                <div className="w-full bg-muted rounded-lg overflow-hidden h-2">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>

                <div className="space-y-2 text-sm">
                  {(searchLogs.length ? searchLogs : ['Searching public web product data']).map((log) => (
                    <div key={log} className="text-foreground">
                      ✓ {log}
                    </div>
                  ))}
                  <div className={cn(searchProgress > 35 ? 'text-foreground' : 'text-muted-foreground')}>
                    ✓ Searching retailers and product results
                  </div>
                  <div className={cn(searchProgress > 65 ? 'text-foreground' : 'text-muted-foreground')}>
                    ✓ Extracting prices and dimensions
                  </div>
                  <div className={cn(searchProgress > 82 ? 'text-foreground' : 'text-muted-foreground')}>
                    ✓ Ranking options by priority
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-900">
                    Live search is used when Bright Data is configured. Otherwise Snap2Room uses mock fallback product data.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Search complete</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review Links */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Review Purchase Options</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select one option per furniture item
              </p>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {purchaseOptions.map((group) => (
                <div key={group.asset.id} className="border rounded-lg p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-20 h-20 flex-shrink-0 bg-white rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
                      <FurniturePhotoThumbnail category={group.asset.category} size="md" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{group.asset.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.asset.adaptedSize?.width}×{group.asset.adaptedSize?.depth}cm
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Source: {productSources[group.asset.id] === 'bright_data' ? 'Bright Data live search' : 'Mock fallback'}
                      </p>
                    </div>
                    <Badge>Selected</Badge>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isSelected = selectedPurchaseOptions[group.asset.id] === option.id;
                      const colors = SOURCE_COLORS[option.source] || SOURCE_COLORS['Argos'];

                      return (
                        <Card
                          key={option.id}
                          className={cn(
                            'p-3 cursor-pointer transition-all',
                            isSelected ? 'border-primary bg-primary/5' : 'border-muted'
                          )}
                          onClick={() =>
                            setSelectedPurchaseOptions({
                              ...selectedPurchaseOptions,
                              [group.asset.id]: option.id,
                            })
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 flex-shrink-0 bg-white rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
                              <FurniturePhotoThumbnail category={group.asset.category} size="sm" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="outline"
                                  className={cn('text-xs', colors.text, colors.bg)}
                                >
                                  {option.source}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {getOptionTypeLabel(option.type)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {option.resultSource === 'bright_data' ? 'Live result' : 'Mock fallback'}
                                </Badge>
                              </div>
                              <h5 className="font-medium text-sm">{option.productName}</h5>
                              <p className="text-xs text-muted-foreground mt-1">{option.retailer}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatDimensions(option.dimensions)}</p>
                              <p className="text-xs text-muted-foreground mt-1">{option.reason}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="font-semibold text-sm">£{option.price}</span>
                                <span className="text-xs text-muted-foreground">
                                  + £{option.delivery} delivery
                                </span>
                                <span className="text-xs font-semibold">£{option.total} total</span>
                              </div>
                            </div>
                            <div className="flex shrink-0 flex-col gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <a
                                  href={option.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Open Link
                                </a>
                              </Button>
                              <Button
                                size="sm"
                                variant={isSelected ? 'default' : 'outline'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPurchaseOptions({
                                    ...selectedPurchaseOptions,
                                    [group.asset.id]: option.id,
                                  });
                                }}
                              >
                                Select Option
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPurchaseOptions((groups) =>
                                    groups.map((item) =>
                                      item.asset.id === group.asset.id
                                        ? { ...item, options: item.options.filter((candidate) => candidate.id !== option.id) }
                                        : item
                                    )
                                  );
                                  if (isSelected) {
                                    const nextOption = group.options.find((candidate) => candidate.id !== option.id);
                                    setSelectedPurchaseOptions({
                                      ...selectedPurchaseOptions,
                                      [group.asset.id]: nextOption?.id ?? '',
                                    });
                                  }
                                }}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">£{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-semibold">£{delivery}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span
                    className={cn(
                      'font-semibold',
                      budgetStatus === 'within' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    £{total}
                  </span>
                </div>
                <div
                  className={cn(
                    'text-xs p-2 rounded',
                    budgetStatus === 'within'
                      ? 'bg-green-50 text-green-900'
                      : 'bg-red-50 text-red-900'
                  )}
                >
                  {budgetStatus === 'within'
                    ? `Within budget (£${roomBudget})`
                    : `Over budget by £${total - roomBudget}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirm Purchase */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Confirm Purchase</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {shoppingSelectedAssetIds.size} items ready for purchase
              </p>
            </div>

            {confirmed ? (
              <div className="py-8 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h4 className="font-semibold mb-2">Mock Purchase Ready</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  In a real version, this would open retailer checkout links.
                </p>
                <Button onClick={handleOpenAllLinks} size="sm">
                  Open All Purchase Links
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {purchaseOptions.map((group) => {
                    const selectedId = selectedPurchaseOptions[group.asset.id];
                    const option = group.options.find((o) => o.id === selectedId);
                    if (!option) return null;

                    const colors = SOURCE_COLORS[option.source] || SOURCE_COLORS['Argos'];

                    return (
                      <div key={group.asset.id} className="border rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 flex-shrink-0 bg-white rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
                            <FurniturePhotoThumbnail category={group.asset.category} size="sm" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-sm">{group.asset.name}</h5>
                            <p className="text-xs text-muted-foreground mt-1">{option.productName}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={cn('text-xs', colors.text, colors.bg)}
                              >
                                {option.source}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span>£{option.price}</span>
                              <span className="text-muted-foreground">+ £{option.delivery} delivery</span>
                              <span className="font-semibold">£{option.total}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                          >
                            <a
                              href={option.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">£{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-semibold">£{delivery}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span
                      className={cn(
                        'font-semibold',
                        budgetStatus === 'within' ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      £{total}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <Separator className="mt-6" />

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </div>

          {step === STEPS.length - 1 ? (
            <Button
              onClick={handleBuyNow}
              disabled={confirmed}
            >
              {confirmed ? 'Completed' : 'Buy Now'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (step === 0 && shoppingSelectedAssetIds.size === 0) ||
                (step === 2 && searching)
              }
            >
              {step === 2 && searching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
