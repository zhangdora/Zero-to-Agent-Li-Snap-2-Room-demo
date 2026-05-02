'use client';

import { useState } from 'react';
import { useWorkflow } from '@/lib/workflow-context';
import { TopNav } from '@/components/editor/TopNav';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { HoverLibraryPanel } from '@/components/editor/HoverLibraryPanel';
import { MainCanvas } from '@/components/panels/MainCanvas';
import { AssetDetailPanel } from '@/components/panels/AssetDetailPanel';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { CreateRoomModal } from '@/components/modals/CreateRoomModal';
import { UploadInspirationModal } from '@/components/modals/UploadInspirationModal';
import { ShoppingListModal } from '@/components/modals/ShoppingListModal';
import { useToast } from '@/hooks/use-toast';
import type { Room } from '@/lib/types';

export default function Home() {
  const { state, dispatch } = useWorkflow();
  const { toast } = useToast();

  // Modal state
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showUploadInspirationModal, setShowUploadInspirationModal] =
    useState(false);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);

  // Project state
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectLibraryAssets, setProjectLibraryAssets] = useState<any[]>([]);
  const [projectPlacedAssets, setProjectPlacedAssets] = useState<any[]>([]);

  // UI state
  const [selectedAssetId, setSelectedAssetId] = useState<string>();
  const [activeFlyoutMenu, setActiveFlyoutMenu] = useState<string | null>(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutTop, setFlyoutTop] = useState(70);
  const [isMouseOverSidebar, setIsMouseOverSidebar] = useState(false);
  const [isMouseOverFlyout, setIsMouseOverFlyout] = useState(false);
  const [closeFlyoutTimeout, setCloseFlyoutTimeout] = useState<NodeJS.Timeout | null>(null);
  const [projectSummaryPanelOpen, setProjectSummaryPanelOpen] = useState(true);

  // Handlers
  const handleCreateProjectComplete = (data: {
    room: any;
    generatedAssets: any[];
    selectedAssets: any[];
    libraryAssets: any[];
    placedAssets: any[];
  }) => {
    // Update workflow state
    dispatch({ type: 'UPDATE_ROOM', payload: data.room });
    dispatch({ type: 'SET_INSPIRATION_UPLOADED', payload: true });
    dispatch({
      type: 'SET_DETECTED_STYLE',
      payload: {
        style: 'Warm minimal',
        colors: ['beige', 'oak', 'cream'],
        materials: ['fabric', 'wood', 'soft lighting'],
        layout: 'sofa against long wall, coffee table centered, floor lamp in corner, rug under seating area',
      },
    });

    // Set the generated assets
    dispatch({
      type: 'SET_ASSETS',
      payload: data.generatedAssets,
    });

    // The library assets should be the selected assets from the modal
    const finalLibraryAssets = data.selectedAssets.length > 0 ? data.selectedAssets : data.libraryAssets;
    
    // Mark which ones are placed (from the Place in Room step)
    const libraryWithPlacement = finalLibraryAssets.map((asset) => ({
      ...asset,
      placedInRoom: data.placedAssets.some((pa) => pa.id === asset.id),
    }));

    // Update local project state
    setProjectCreated(true);
    setProjectLibraryAssets(libraryWithPlacement);
    setProjectPlacedAssets(data.placedAssets);

    toast({
      title: 'Project created successfully',
      description: `Room configured with ${data.placedAssets.length} furniture items placed`,
    });
  };

  const handleCreateRoom = (room: Room) => {
    dispatch({ type: 'UPDATE_ROOM', payload: room });
    setShowCreateRoomModal(false);
    toast({
      title: 'Room layout generated',
      description: `${room.dimensions.width}m × ${room.dimensions.depth}m room created`,
    });
  };

  const handleUseDefaultInspiration = () => {
    // Generate mock assets
    dispatch({ type: 'SET_INSPIRATION_UPLOADED', payload: true });

    // Generate the style and assets
    const defaultAssets = [
      {
        id: 'asset-1',
        name: 'Beige Compact Sofa',
        category: 'sofa' as const,
        source: 'Inspiration image',
        originalSize: { width: 220, depth: 90, height: 80 },
        adaptedSize: { width: 185, depth: 85, height: 78 },
        color: 'beige',
        material: 'fabric',
        style: 'warm minimal',
        fitStatus: 'good' as const,
        doorwayStatus: 'passed' as const,
        inLibrary: false,
        placedInRoom: false,
        lowestPrice: 329,
      },
      {
        id: 'asset-2',
        name: 'Oak Coffee Table',
        category: 'coffee-table' as const,
        source: 'Inspiration image',
        originalSize: { width: 120, depth: 60, height: 42 },
        adaptedSize: { width: 95, depth: 55, height: 40 },
        color: 'oak',
        material: 'wood',
        style: 'warm minimal',
        fitStatus: 'good' as const,
        doorwayStatus: 'passed' as const,
        inLibrary: false,
        placedInRoom: false,
        lowestPrice: 89,
      },
      {
        id: 'asset-3',
        name: 'Warm Floor Lamp',
        category: 'floor-lamp' as const,
        source: 'Inspiration image',
        originalSize: { width: 40, depth: 40, height: 160 },
        adaptedSize: { width: 35, depth: 35, height: 150 },
        color: 'cream',
        material: 'metal / fabric',
        style: 'warm minimal',
        fitStatus: 'good' as const,
        doorwayStatus: 'passed' as const,
        inLibrary: false,
        placedInRoom: false,
        lowestPrice: 45,
      },
      {
        id: 'asset-4',
        name: 'Neutral Rug',
        category: 'rug' as const,
        source: 'Inspiration image',
        originalSize: { width: 240, depth: 160, height: 2 },
        adaptedSize: { width: 200, depth: 140, height: 2 },
        color: 'cream',
        material: 'textile',
        style: 'warm minimal',
        fitStatus: 'good' as const,
        doorwayStatus: 'passed' as const,
        inLibrary: false,
        placedInRoom: false,
        lowestPrice: 120,
      },
      {
        id: 'asset-5',
        name: 'Low TV Stand',
        category: 'tv-stand' as const,
        source: 'Inspiration image',
        originalSize: { width: 180, depth: 45, height: 50 },
        adaptedSize: { width: 160, depth: 42, height: 48 },
        color: 'walnut',
        material: 'wood',
        style: 'warm minimal',
        fitStatus: 'good' as const,
        doorwayStatus: 'passed' as const,
        inLibrary: false,
        placedInRoom: false,
        lowestPrice: 199,
      },
    ];

    dispatch({ type: 'SET_ASSETS', payload: defaultAssets });
    dispatch({
      type: 'SET_DETECTED_STYLE',
      payload: {
        style: 'Warm minimal',
        colors: ['beige', 'oak', 'cream'],
        materials: ['fabric', 'wood', 'soft lighting'],
        layout:
          'sofa against long wall, coffee table centered, floor lamp in corner, rug under seating area',
      },
    });

    setShowUploadInspirationModal(false);
    toast({
      title: '5 furniture assets detected',
      description: 'from inspiration image',
    });
  };

  const handleAddToLibrary = (assetId: string) => {
    dispatch({ type: 'ADD_TO_LIBRARY', payload: assetId });
    toast({
      title: 'Asset added to library',
    });
  };

  const handleAddAllToLibrary = () => {
    dispatch({ type: 'ADD_ALL_TO_LIBRARY' });
    toast({
      title: 'All assets added to library',
    });
  };

  const handlePlaceInRoom = (assetId: string) => {
    dispatch({ type: 'PLACE_IN_ROOM', payload: assetId });
    toast({
      title: 'Furniture placed in room',
    });
  };

  const handleRemoveFromRoom = (assetId: string) => {
    dispatch({ type: 'REMOVE_FROM_ROOM', payload: assetId });
    toast({
      title: 'Furniture removed from room',
    });
  };

  const handleAddFurnitureToCanvas = (asset: any) => {
    // Check if room exists
    if (!state.room) {
      toast({
        title: 'Create a room first',
        description: 'You need to set up a room before adding furniture.',
      });
      return;
    }

    // Get default position based on category
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

    // Check if already placed
    const isAlreadyPlaced = projectPlacedAssets.some((a) => a.id === asset.id);
    if (isAlreadyPlaced) {
      toast({
        title: 'Already placed',
        description: `${asset.name} is already on the canvas.`,
      });
      return;
    }

    // Add to placed assets with default position
    const assetWithPosition = {
      ...asset,
      placedInRoom: true,
      position: getDefaultPosition(asset.category),
    };
    
    setProjectPlacedAssets([...projectPlacedAssets, assetWithPosition]);
    setSelectedAssetId(asset.id);
    
    toast({
      title: 'Furniture added',
      description: asset.name,
    });
  };

  const handlePanelMouseEnter = () => {
    // Panel stays open when user moves mouse into it
  };

  const handlePanelMouseLeave = () => {
    // Panel stays open until explicitly closed or user hovers another item
  };

  const handleCategoryHovered = (category: string | null, event?: React.MouseEvent) => {
    // Clear any pending close timeout
    if (closeFlyoutTimeout) {
      clearTimeout(closeFlyoutTimeout);
      setCloseFlyoutTimeout(null);
    }

    if (category) {
      setActiveFlyoutMenu(category);
      setFlyoutOpen(true);
      
      // Calculate position relative to the menu item
      if (event) {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setFlyoutTop(Math.max(12, rect.top - 20));
      }
    }
  };

  const handleCloseFlyout = () => {
    setFlyoutOpen(false);
    setActiveFlyoutMenu(null);
  };

  const scheduleCloseFlyout = () => {
    // Only close if mouse is not over both sidebar and flyout
    const timeout = setTimeout(() => {
      if (!isMouseOverSidebar && !isMouseOverFlyout) {
        setFlyoutOpen(false);
        setActiveFlyoutMenu(null);
      }
    }, 150);
    setCloseFlyoutTimeout(timeout);
  };

  const handleSidebarMouseEnter = () => {
    setIsMouseOverSidebar(true);
    if (closeFlyoutTimeout) {
      clearTimeout(closeFlyoutTimeout);
      setCloseFlyoutTimeout(null);
    }
  };

  const handleSidebarMouseLeave = () => {
    setIsMouseOverSidebar(false);
    if (!isMouseOverFlyout) {
      scheduleCloseFlyout();
    }
  };

  const handleFlyoutMouseEnter = () => {
    setIsMouseOverFlyout(true);
    if (closeFlyoutTimeout) {
      clearTimeout(closeFlyoutTimeout);
      setCloseFlyoutTimeout(null);
    }
  };

  const handleFlyoutMouseLeave = () => {
    setIsMouseOverFlyout(false);
    if (!isMouseOverSidebar) {
      scheduleCloseFlyout();
    }
  };

  // Determine which assets to show
  const generatedAssets = state.assets.filter((a) => !a.inLibrary);
  const libraryAssets = state.library;
  const placedAssets = state.library.filter((a) => a.placedInRoom);

  const selectedAsset =
    generatedAssets.find((a) => a.id === selectedAssetId) ||
    libraryAssets.find((a) => a.id === selectedAssetId);

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Top Navigation */}
      <TopNav
        projectName={state.room?.name || 'New Project'}
        onSave={() => toast({ title: 'Plan saved' })}
        onNewProject={() => setShowCreateProjectModal(true)}
        onGenerateShoppingList={() => {
          if (!projectCreated || projectPlacedAssets.length === 0) {
            toast({
              title: 'No furniture to purchase',
              description: 'Create a project and place furniture before generating a shopping list.',
            });
          } else {
            setShowShoppingListModal(true);
          }
        }}
        isSignedIn={false}
        onSignIn={() => console.log('Sign in clicked')}
      />

      {/* Main Layout */}
      <div className="fixed top-14 left-0 right-0 bottom-0 flex">
        {/* Sidebar Container with mouse tracking */}
        <div
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
        >
          {/* Left Sidebar */}
          <EditorSidebar
            activeCategory="room"
            onCategoryChange={(category) => {
              if (category === 'room') {
                setShowCreateRoomModal(true);
              }
            }}
            onHoveredCategoryChange={handleCategoryHovered}
          />
        </div>

        {/* Hover Library Panel (Flyout) - with mouse tracking */}
        <div
          onMouseEnter={handleFlyoutMouseEnter}
          onMouseLeave={handleFlyoutMouseLeave}
        >
          <HoverLibraryPanel
            isVisible={flyoutOpen}
            category={activeFlyoutMenu || ''}
            flyoutTop={flyoutTop}
            onClose={handleCloseFlyout}
            roomSummary={
              state.room
                ? {
                    width: state.room.dimensions.width,
                    depth: state.room.dimensions.depth,
                    height: state.room.dimensions.height,
                    doorWidth: state.room.door?.width || state.room.doorway?.width || 0.8,
                    budget: state.room.budget,
                  }
                : undefined
            }
            assets={
              activeFlyoutMenu === 'mylibrary'
                ? projectCreated ? projectLibraryAssets : state.library
                : activeFlyoutMenu === 'seating'
                ? (projectCreated ? projectLibraryAssets : state.library).filter((a) => a.category === 'sofa')
                : activeFlyoutMenu === 'tables'
                ? (projectCreated ? projectLibraryAssets : state.library).filter((a) => a.category === 'coffee-table')
                : activeFlyoutMenu === 'lighting'
                ? (projectCreated ? projectLibraryAssets : state.library).filter((a) => a.category === 'floor-lamp')
                : activeFlyoutMenu === 'rugs'
                ? (projectCreated ? projectLibraryAssets : state.library).filter((a) => a.category === 'rug')
                : activeFlyoutMenu === 'storage'
                ? (projectCreated ? projectLibraryAssets : state.library).filter((a) => a.category === 'tv-stand')
                : []
            }
            onAddFurniture={handleAddFurnitureToCanvas}
          />
        </div>

        {/* Center Canvas */}
        <MainCanvas
          room={state.room}
          placedAssets={projectCreated ? projectPlacedAssets : state.library.filter((a) => a.placedInRoom)}
          selectedAssetId={selectedAssetId}
          onSelectAsset={(asset) => setSelectedAssetId(asset?.id)}
          onRemoveAsset={(assetId) => {
            if (projectCreated) {
              setProjectPlacedAssets(projectPlacedAssets.filter((asset) => asset.id !== assetId));
              setProjectLibraryAssets(
                projectLibraryAssets.map((asset) =>
                  asset.id === assetId ? { ...asset, placedInRoom: false } : asset
                )
              );
            } else {
              dispatch({ type: 'REMOVE_FROM_ROOM', payload: assetId });
            }
            setSelectedAssetId(undefined);
            toast({ title: 'Furniture removed from room' });
          }}
        />

        {/* Right Detail Panel */}
        {selectedAssetId ? (
          <AssetDetailPanel
            asset={
              (projectCreated ? projectLibraryAssets : state.library).find(
                (a) => a.id === selectedAssetId
              ) || state.assets.find((a) => a.id === selectedAssetId)
            }
            room={state.room}
            placedAssets={projectCreated ? projectPlacedAssets : state.library.filter((a) => a.placedInRoom)}
            projectName={state.room?.name || 'My Project'}
            onAddToLibrary={handleAddToLibrary}
            onPlaceInRoom={handlePlaceInRoom}
            onFindOptions={() => console.log('Find options clicked')}
            isInLibrary={
              (projectCreated ? projectLibraryAssets : state.library).find(
                (a) => a.id === selectedAssetId
              )
                ? true
                : false
            }
            isPlacedInRoom={
              (projectCreated ? projectLibraryAssets : state.library).find(
                (a) => a.id === selectedAssetId
              )?.placedInRoom || false
            }
            onRemoveFromLibrary={(assetId) => {
              if (projectCreated) {
                setProjectLibraryAssets(
                  projectLibraryAssets.filter((a) => a.id !== assetId)
                );
                setProjectPlacedAssets(
                  projectPlacedAssets.filter((a) => a.id !== assetId)
                );
              } else {
                dispatch({ type: 'REMOVE_FROM_LIBRARY', payload: assetId });
              }
              setSelectedAssetId(undefined);
              toast({
                title: 'Asset removed from library',
              });
            }}
          />
        ) : projectSummaryPanelOpen && state.room ? (
          <div className="w-80 bg-card border-l border-border h-full flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Project Summary</h3>
              <button
                onClick={() => setProjectSummaryPanelOpen(false)}
                className="h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center text-sm font-semibold"
                title="Collapse Project Summary"
              >
                {'>'}
                {'>'}
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto">
              <div>
                <p className="text-xs text-muted-foreground">Project Name</p>
                <p className="font-medium text-sm">{state.room?.name || 'My Project'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Room Type</p>
                  <p className="font-medium">{state.room?.type || 'Living Room'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="font-medium">£{state.room?.budget || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Width</p>
                  <p className="font-medium">{state.room?.dimensions.width}m</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Depth</p>
                  <p className="font-medium">{state.room?.dimensions.depth}m</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="font-medium">{state.room?.dimensions.height}m</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Items Placed</p>
                  <p className="font-medium">{(projectCreated ? projectPlacedAssets : state.library.filter((a) => a.placedInRoom)).length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Door Width</p>
                  <p className="font-medium">{state.room?.door?.width || state.room?.doorway?.width || 0.8}m</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Door Height</p>
                  <p className="font-medium">{state.room?.door?.height || state.room?.doorway?.height || 2.0}m</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground border-t border-border pt-3">
                <p>Door position: <span className="font-medium text-foreground capitalize">{state.room?.door?.position || state.room?.doorway?.position || 'front'}</span></p>
              </div>
              {(projectCreated ? projectPlacedAssets : state.library.filter((a) => a.placedInRoom)).length > 0 && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Furniture ({(projectCreated ? projectPlacedAssets : state.library.filter((a) => a.placedInRoom)).length})</p>
                  <ul className="space-y-1">
                    {(projectCreated ? projectPlacedAssets : state.library.filter((a) => a.placedInRoom)).map((asset) => (
                      <li key={asset.id} className="text-xs text-foreground">
                        <span className="font-medium">{asset.name}</span>
                        {asset.colour && <span className="text-muted-foreground"> • {asset.colour}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Floating Expand Button for Collapsed Project Summary */}
      {!selectedAssetId && !projectSummaryPanelOpen && state.room && (
        <button
          onClick={() => setProjectSummaryPanelOpen(true)}
          className="fixed right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-card border border-border rounded hover:bg-muted text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors z-40"
          title="Expand Project Summary"
        >
          {'<'}
          {'<'}
        </button>
      )}

      {/* Modals */}
      <CreateProjectModal
        open={showCreateProjectModal}
        onOpenChange={setShowCreateProjectModal}
        onComplete={handleCreateProjectComplete}
      />

      <CreateRoomModal
        open={showCreateRoomModal}
        onOpenChange={setShowCreateRoomModal}
        onGenerate={handleCreateRoom}
      />

      <UploadInspirationModal
        open={showUploadInspirationModal}
        onOpenChange={setShowUploadInspirationModal}
        onUseDefault={handleUseDefaultInspiration}
      />

      <ShoppingListModal
        open={showShoppingListModal}
        onOpenChange={setShowShoppingListModal}
        placedAssets={projectCreated ? projectPlacedAssets : placedAssets}
        room={state.room}
        roomBudget={state.room?.budget || 800}
      />
    </div>
  );
}
