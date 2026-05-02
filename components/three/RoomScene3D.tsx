'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { Asset, Room } from '@/lib/types';
import { RoomShell3D } from './RoomShell3D';
import { FurniturePrimitive3D } from './FurniturePrimitive3D';

export type RoomScene3DProps = {
  room: Room | null;
  placedAssets: Asset[];
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string | null) => void;
  onRemoveAsset?: (assetId: string) => void;
  resetToken?: number;
};

export function RoomScene3D({
  room,
  placedAssets,
  selectedAssetId,
  onSelectAsset,
  resetToken = 0,
}: RoomScene3DProps) {
  const cameraPosition = useMemo<[number, number, number]>(() => {
    if (!room) return [4, 4, 5];
    return [
      room.dimensions.width * 0.8,
      room.dimensions.height * 1.6,
      room.dimensions.depth * 1.2,
    ];
  }, [room]);

  const target = useMemo<[number, number, number]>(() => {
    if (!room) return [0, 1, 0];
    return [0, room.dimensions.height * 0.4, 0];
  }, [room]);

  if (!room) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-muted-foreground">
        Create a new project to generate a room preview.
      </div>
    );
  }

  return (
    <Canvas
      shadows
      className="h-full w-full bg-slate-50"
      onPointerMissed={() => onSelectAsset(null)}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#f8fafc']} />
      <PerspectiveCamera key={`camera-${resetToken}`} makeDefault position={cameraPosition} fov={50} />
      <OrbitControls
        key={`controls-${resetToken}`}
        enableDamping
        enablePan
        enableZoom
        maxPolarAngle={Math.PI / 2.1}
        target={target}
      />
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#ffffff', '#d8b98c', 0.55]} />
      <directionalLight
        castShadow
        position={[room.dimensions.width * 0.3, room.dimensions.height * 2.2, room.dimensions.depth * 0.8]}
        intensity={1.1}
      />

      <Suspense fallback={null}>
        <RoomShell3D room={room} />
        {placedAssets.map((asset) => (
          <FurniturePrimitive3D
            key={asset.id}
            asset={asset}
            room={room}
            selected={asset.id === selectedAssetId}
            onSelect={onSelectAsset}
          />
        ))}
      </Suspense>
    </Canvas>
  );
}
