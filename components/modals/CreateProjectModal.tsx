'use client';

import { useState, useEffect } from 'react';
import type { Room, Asset } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Armchair, Coffee, Lamp, Square, Tv, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';
import { DefaultInspirationPreview } from '@/components/ui/default-inspiration-preview';
import { DefaultInspirationPhoto } from '@/components/ui/default-inspiration-photo';
import { FurnitureThumbnail } from '@/components/ui/furniture-thumbnail';
import { FurniturePhotoThumbnail } from '@/components/ui/furniture-photo-thumbnail';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sofa: Armchair,
  'coffee-table': Coffee,
  'floor-lamp': Lamp,
  rug: Square,
  'tv-stand': Tv,
};

const CATEGORY_LABELS: Record<string, string> = {
  sofa: 'Seating',
  'coffee-table': 'Tables',
  'floor-lamp': 'Lighting',
  rug: 'Rugs',
  'tv-stand': 'Storage',
};

const MOCK_GENERATED_ASSETS: Asset[] = [
  {
    id: 'gen-asset-1',
    name: 'Beige Compact Sofa',
    category: 'sofa',
    source: 'Generated from inspiration',
    originalSize: { width: 220, depth: 90, height: 80 },
    adaptedSize: { width: 185, depth: 85, height: 78 },
    color: 'beige',
    material: 'fabric',
    style: 'warm minimal',
    fitStatus: 'good',
    doorwayStatus: 'passed',
    inLibrary: false,
    placedInRoom: false,
    lowestPrice: 329,
  },
  {
    id: 'gen-asset-2',
    name: 'Oak Coffee Table',
    category: 'coffee-table',
    source: 'Generated from inspiration',
    originalSize: { width: 120, depth: 60, height: 42 },
    adaptedSize: { width: 95, depth: 55, height: 40 },
    color: 'oak',
    material: 'wood',
    style: 'warm minimal',
    fitStatus: 'good',
    doorwayStatus: 'passed',
    inLibrary: false,
    placedInRoom: false,
    lowestPrice: 89,
  },
  {
    id: 'gen-asset-3',
    name: 'Warm Floor Lamp',
    category: 'floor-lamp',
    source: 'Generated from inspiration',
    originalSize: { width: 40, depth: 40, height: 160 },
    adaptedSize: { width: 35, depth: 35, height: 150 },
    color: 'cream',
    material: 'metal / fabric',
    style: 'warm minimal',
    fitStatus: 'good',
    doorwayStatus: 'passed',
    inLibrary: false,
    placedInRoom: false,
    lowestPrice: 45,
  },
  {
    id: 'gen-asset-4',
    name: 'Neutral Rug',
    category: 'rug',
    source: 'Generated from inspiration',
    originalSize: { width: 240, depth: 160, height: 2 },
    adaptedSize: { width: 200, depth: 140, height: 2 },
    color: 'cream',
    material: 'textile',
    style: 'warm minimal',
    fitStatus: 'good',
    doorwayStatus: 'passed',
    inLibrary: false,
    placedInRoom: false,
    lowestPrice: 120,
  },
  {
    id: 'gen-asset-5',
    name: 'Low TV Stand',
    category: 'tv-stand',
    source: 'Generated from inspiration',
    originalSize: { width: 180, depth: 45, height: 50 },
    adaptedSize: { width: 160, depth: 42, height: 48 },
    color: 'walnut',
    material: 'wood',
    style: 'warm minimal',
    fitStatus: 'good',
    doorwayStatus: 'passed',
    inLibrary: false,
    placedInRoom: false,
    lowestPrice: 199,
  },
];

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: {
    room: Room;
    generatedAssets: Asset[];
    selectedAssets: Asset[];
    libraryAssets: Asset[];
    placedAssets: Asset[];
  }) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  onComplete,
}: CreateProjectModalProps) {
  const [step, setStep] = useState(1);

  // Room Setup state
  const [roomWidth, setRoomWidth] = useState(4.2);
  const [roomDepth, setRoomDepth] = useState(3.6);
  const [roomHeight, setRoomHeight] = useState(2.5);
  const [doorWidth, setDoorWidth] = useState(0.8);
  const [doorHeight, setDoorHeight] = useState(2.0);
  const [doorPosition, setDoorPosition] = useState<'front' | 'back' | 'left' | 'right'>('front');
  const [budget, setBudget] = useState(800);

  // Inspiration state
  const [inspirationSelected, setInspirationSelected] = useState(false);

  // Generate Models state
  const [generatedAssets, setGeneratedAssets] = useState<Asset[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Add to Library state
  const [libraryAssets, setLibraryAssets] = useState<Asset[]>([]);

  // Place in Room state
  const [placedAssets, setPlacedAssets] = useState<Asset[]>([]);

  // Initialize generated assets on step 3
  useEffect(() => {
    if (step === 3 && generatedAssets.length === 0) {
      setGeneratedAssets(MOCK_GENERATED_ASSETS);
      setSelectedAssetIds(MOCK_GENERATED_ASSETS.map((a) => a.id));
    }
  }, [step, generatedAssets.length]);

  const handleNext = () => {
    if (step === 4 && libraryAssets.length === 0) {
      // Adding to library
      const selected = generatedAssets.filter((a) => selectedAssetIds.includes(a.id));
      setLibraryAssets(selected);
    }
    if (step === 5 && placedAssets.length === 0) {
      // Default placement in room
      const defaultPlaced = libraryAssets.map((asset) => ({
        ...asset,
        placedInRoom: true,
      }));
      setPlacedAssets(defaultPlaced);
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleFinish = () => {
    const room: Room = {
      type: 'living-room',
      name: 'My New Project',
      dimensions: { width: roomWidth, depth: roomDepth, height: roomHeight },
      door: { width: doorWidth, height: doorHeight, position: doorPosition },
      budget,
    };

    // Get selected assets with default positioning
    const selectedAssets = generatedAssets.filter((a) => selectedAssetIds.includes(a.id));
    
    // Function to get default position based on category
    const getDefaultPosition = (category: string) => {
      const positions: Record<string, { x: number; y: number }> = {
        sofa: { x: 25, y: 25 },
        'coffee-table': { x: 50, y: 50 },
        rug: { x: 50, y: 52 },
        'floor-lamp': { x: 15, y: 15 },
        'tv-stand': { x: 75, y: 25 },
      };
      return positions[category] || { x: 50, y: 50 };
    };

    // Create placed assets with positioning
    const placedAssetsWithPosition = selectedAssets.map((asset) => ({
      ...asset,
      placedInRoom: true,
      position: getDefaultPosition(asset.category),
    }));

    onComplete({
      room,
      generatedAssets,
      selectedAssets,
      libraryAssets: selectedAssets, // Library assets should be the selected ones
      placedAssets: placedAssetsWithPosition,
    });

    onOpenChange(false);
  };

  const toggleAssetSelection = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds(selectedAssetIds.filter((aid) => aid !== id));
    } else {
      setSelectedAssetIds([...selectedAssetIds, id]);
    }
  };

  const removeAsset = (id: string) => {
    setGeneratedAssets(generatedAssets.filter((a) => a.id !== id));
    setSelectedAssetIds(selectedAssetIds.filter((aid) => aid !== id));
  };

  const steps = ['Room Setup', 'Inspiration', 'Generate Models', 'Add to Library', 'Place in Room'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Start with your room, choose an inspiration image, generate assets, and place them into your layout.
          </p>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex gap-2 mb-6 mt-4">
          {steps.map((stepName, idx) => (
            <div key={idx} className="flex-1">
              <div className={cn(
                'h-2 rounded-full transition-colors',
                idx + 1 <= step ? 'bg-primary' : 'bg-muted'
              )} />
              <p className={cn(
                'text-xs mt-2 text-center',
                idx + 1 <= step ? 'font-semibold text-foreground' : 'text-muted-foreground'
              )}>
                {stepName}
              </p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-96">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Room Setup</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Room Type</Label>
                  <div className="mt-1 px-3 py-2 bg-muted rounded text-sm">Living Room</div>
                </div>
                <div>
                  <Label className="text-xs">Budget</Label>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="text-sm h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Width (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(Number(e.target.value))}
                    className="text-sm h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Depth (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={roomDepth}
                    onChange={(e) => setRoomDepth(Number(e.target.value))}
                    className="text-sm h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={roomHeight}
                    onChange={(e) => setRoomHeight(Number(e.target.value))}
                    className="text-sm h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Door Width (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={doorWidth}
                    onChange={(e) => setDoorWidth(Number(e.target.value))}
                    className="text-sm h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Door Height (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={doorHeight}
                    onChange={(e) => setDoorHeight(Number(e.target.value))}
                    className="text-sm h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Door Position</Label>
                  <Select value={doorPosition} onValueChange={(val: any) => setDoorPosition(val)}>
                    <SelectTrigger className="h-8 text-sm">
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

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                <p className="text-xs font-semibold text-blue-900">Room Summary</p>
                <p className="text-xs text-blue-800 mt-1">
                  {roomWidth}m × {roomDepth}m × {roomHeight}m | Door: {doorWidth}m ({doorPosition}) | Budget: £{budget}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Inspiration Image</h3>
              <p className="text-xs text-muted-foreground">
                For this demo, Snap2Room uses a default system inspiration image.
              </p>

              {inspirationSelected ? (
                <>
                  <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md">
                    <DefaultInspirationPhoto size="md" />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 mb-2">
                      Default image selected
                    </Badge>
                    <p className="text-xs font-semibold text-blue-900 mb-2">Detected Style</p>
                    <div className="space-y-1">
                      <p className="text-xs text-blue-800"><span className="font-semibold">Style:</span> Warm minimal</p>
                      <p className="text-xs text-blue-800"><span className="font-semibold">Colours:</span> beige, oak, cream</p>
                      <p className="text-xs text-blue-800"><span className="font-semibold">Materials:</span> fabric, wood, soft lighting</p>
                      <p className="text-xs text-blue-800"><span className="font-semibold">Layout:</span> sofa against long wall, coffee table centered, floor lamp in corner, rug under seating area</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <DefaultInspirationPhoto size="md" />

                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-2">Detected Style (Preview)</p>
                    <div className="space-y-1">
                      <p className="text-xs text-blue-800"><span className="font-semibold">Style:</span> Warm minimal</p>
                      <p className="text-xs text-blue-800"><span className="font-semibold">Colours:</span> beige, oak, cream</p>
                      <p className="text-xs text-blue-800"><span className="font-semibold">Materials:</span> fabric, wood, soft lighting</p>
                      <p className="text-xs text-blue-800"><span className="font-semibold">Layout:</span> sofa against long wall, coffee table centered, floor lamp in corner, rug under seating area</p>
                    </div>
                  </div>

                  <Button
                    className="w-full text-sm"
                    onClick={() => setInspirationSelected(true)}
                  >
                    Use Default Image
                  </Button>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Generate Models</h3>
              <p className="text-xs text-muted-foreground">
                Generated furniture assets from the inspiration image. Assets automatically categorized.
              </p>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {generatedAssets.map((asset) => {
                  const Icon = CATEGORY_ICONS[asset.category];
                  const isSelected = selectedAssetIds.includes(asset.id);

                  return (
                    <div
                      key={asset.id}
                      className={cn(
                        'p-3 rounded border-2 transition-colors',
                        isSelected ? 'border-primary bg-blue-50' : 'border-border bg-background'
                      )}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleAssetSelection(asset.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold">{asset.name}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {CATEGORY_LABELS[asset.category]}
                          </Badge>
                        </div>
                      </div>

                      <div className="w-full h-20 bg-white rounded-md border border-slate-200 flex items-center justify-center mb-2 overflow-hidden">
                        <FurniturePhotoThumbnail category={asset.category} size="md" />
                      </div>

                      <div className="text-xs space-y-1 mb-2 text-muted-foreground">
                        <p>Original: {asset.originalSize?.width}×{asset.originalSize?.depth}cm</p>
                        <p>Adapted: {asset.adaptedSize?.width}×{asset.adaptedSize?.depth}cm</p>
                      </div>

                      <div className="flex gap-1">
                        <Badge className="text-xs bg-green-100 text-green-900 hover:bg-green-100">
                          {asset.fitStatus}
                        </Badge>
                        <Badge className="text-xs bg-green-100 text-green-900 hover:bg-green-100">
                          {asset.doorwayStatus}
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 text-xs text-destructive"
                        onClick={() => removeAsset(asset.id)}
                      >
                        <Trash2 size={12} />
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>

              {selectedAssetIds.length === 0 && (
                <p className="text-sm text-destructive">At least one model must be selected</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Add to Library</h3>
              <p className="text-xs text-muted-foreground">
                Selected models will be added to your personal library and automatically categorized.
              </p>

              {selectedAssetIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-xs text-blue-900">
                    These {selectedAssetIds.length} models will be added to My Library and appear under their matching category in the left menu.
                  </p>
                </div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(
                  generatedAssets
                    .filter((a) => selectedAssetIds.includes(a.id))
                    .reduce(
                      (acc, asset) => {
                        const cat = CATEGORY_LABELS[asset.category];
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(asset);
                        return acc;
                      },
                      {} as Record<string, Asset[]>
                    )
                ).map(([category, assets]) => (
                  <div key={category}>
                    <p className="text-xs font-semibold mb-2">{category}</p>
                    {assets.map((asset) => (
                      <div key={asset.id} className="bg-background border border-border rounded p-3 mb-2">
                        <div className="flex gap-3 items-start">
                          <div className="w-20 h-20 flex-shrink-0 bg-white rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
                            <FurniturePhotoThumbnail category={asset.category} size="md" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold">{asset.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {asset.adaptedSize?.width}×{asset.adaptedSize?.depth}cm
                            </p>
                            <Badge variant="secondary" className="text-xs mt-2">Ready to add</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Place in Room</h3>
              <p className="text-xs text-muted-foreground">
                Choose which library models to place into the room layout.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Left: Asset list */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold">Library Assets</p>
                  <div className="border border-border rounded p-3 space-y-2 max-h-72 overflow-y-auto">
                    {libraryAssets.map((asset) => {
                      const isPlaced = placedAssets.some((pa) => pa.id === asset.id);
                      return (
                        <button
                          key={asset.id}
                          onClick={() => {
                            if (isPlaced) {
                              setPlacedAssets(placedAssets.filter((pa) => pa.id !== asset.id));
                            } else {
                              setPlacedAssets([...placedAssets, { ...asset, placedInRoom: true }]);
                            }
                          }}
                          className={cn(
                            'w-full p-2 rounded text-xs text-left transition-colors',
                            isPlaced ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                          )}
                        >
                          {asset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: 2D room preview */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold">Room Preview</p>
                  <div className="border-2 border-border rounded bg-white aspect-square max-h-72 relative overflow-hidden">
                    {/* Room boundary */}
                    <svg className="w-full h-full" viewBox="0 0 300 250">
                      {/* Floor */}
                      <rect x="20" y="20" width="260" height="210" fill="#f5f5f5" stroke="#ccc" strokeWidth="2" />

                      {/* Door */}
                      <rect x={doorPosition === 'front' ? 130 : doorPosition === 'back' ? 130 : doorPosition === 'left' ? 20 : 260} y={doorPosition === 'front' || doorPosition === 'back' ? 20 : 100} width={doorPosition === 'front' || doorPosition === 'back' ? 40 : 10} height={doorPosition === 'front' || doorPosition === 'back' ? 10 : 40} fill="#ff6b6b" />

                      {/* Placed furniture shapes */}
                      {placedAssets.map((asset) => {
                        const scale = 100 / Math.max(roomWidth, roomDepth);
                        let x = 50, y = 50, w = 80, h = 40;

                        if (asset.category === 'sofa') {
                          x = 40; y = 140; w = 120; h = 35;
                        } else if (asset.category === 'coffee-table') {
                          x = 90; y = 100; w = 50; h = 30;
                        } else if (asset.category === 'rug') {
                          x = 60; y = 80; w = 100; h = 70;
                        } else if (asset.category === 'floor-lamp') {
                          x = 30; y = 50; w = 20; h = 20;
                        } else if (asset.category === 'tv-stand') {
                          x = 90; y = 40; w = 60; h = 20;
                        }

                        return (
                          <rect
                            key={asset.id}
                            x={x}
                            y={y}
                            width={w}
                            height={h}
                            fill="#94a3b8"
                            stroke="#475569"
                            strokeWidth="2"
                            rx="4"
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {placedAssets.length} item{placedAssets.length !== 1 ? 's' : ''} placed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft size={16} />
            Back
          </Button>

          {step < 5 && (
            <Button
              onClick={handleNext}
              disabled={(step === 2 && !inspirationSelected) || (step === 3 && selectedAssetIds.length === 0)}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          )}

          {step === 5 && (
            <Button
              onClick={handleFinish}
              className="bg-green-600 hover:bg-green-700"
            >
              Finish Project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
