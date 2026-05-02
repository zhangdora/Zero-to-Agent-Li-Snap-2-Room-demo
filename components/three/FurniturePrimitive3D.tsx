'use client';

import { useMemo, useState } from 'react';
import { Html, useCursor } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { Asset, Room } from '@/lib/types';
import { CoffeeTablePrimitive } from './primitives/CoffeeTablePrimitive';
import { FloorLampPrimitive } from './primitives/FloorLampPrimitive';
import { RugPrimitive } from './primitives/RugPrimitive';
import { SofaPrimitive } from './primitives/SofaPrimitive';
import { TVStandPrimitive } from './primitives/TVStandPrimitive';

type FurniturePrimitive3DProps = {
  asset: Asset;
  room: Room;
  selected: boolean;
  onSelect: (assetId: string) => void;
};

type DimensionsM = {
  width: number;
  depth: number;
  height: number;
};

type PositionLike = {
  x?: number;
  y?: number;
  z?: number;
};

const CATEGORY_ALIASES: Record<string, string> = {
  seating: 'sofa',
  sofa: 'sofa',
  tables: 'coffee-table',
  coffee_table: 'coffee-table',
  'coffee-table': 'coffee-table',
  lighting: 'floor-lamp',
  floor_lamp: 'floor-lamp',
  'floor-lamp': 'floor-lamp',
  rugs: 'rug',
  rug: 'rug',
  storage: 'tv-stand',
  tv_stand: 'tv-stand',
  'tv-stand': 'tv-stand',
};

function normalizeCategory(asset: Asset) {
  const category = asset.category || '';
  const lowerName = asset.name.toLowerCase();

  if (CATEGORY_ALIASES[category]) return CATEGORY_ALIASES[category];
  if (lowerName.includes('sofa')) return 'sofa';
  if (lowerName.includes('coffee')) return 'coffee-table';
  if (lowerName.includes('lamp')) return 'floor-lamp';
  if (lowerName.includes('rug')) return 'rug';
  if (lowerName.includes('tv') || lowerName.includes('stand')) return 'tv-stand';
  return category;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getAssetDimensionsM(asset: Asset, room: Room): DimensionsM {
  const source = asset.adaptedSize ?? asset.dimensions ?? asset.originalSize ?? { width: 100, depth: 60, height: 60 };
  const width = clamp(source.width / 100, 0.18, Math.max(room.dimensions.width * 0.8, 0.18));
  const depth = clamp(source.depth / 100, 0.18, Math.max(room.dimensions.depth * 0.8, 0.18));
  const height = clamp(source.height / 100, 0.03, Math.max(room.dimensions.height * 0.9, 0.03));

  return { width, depth, height };
}

export function getDefault3DPosition(asset: Asset, room: Room, dimensions: DimensionsM): [number, number, number] {
  const category = normalizeCategory(asset);
  const position = asset.position as PositionLike | undefined;

  if (position && typeof position.x === 'number') {
    if (typeof position.z === 'number') {
      return [
        clamp(position.x, -room.dimensions.width / 2 + dimensions.width / 2, room.dimensions.width / 2 - dimensions.width / 2),
        position.y ?? dimensions.height / 2,
        clamp(position.z, -room.dimensions.depth / 2 + dimensions.depth / 2, room.dimensions.depth / 2 - dimensions.depth / 2),
      ];
    }

    if (typeof position.y === 'number' && position.x >= 0 && position.x <= 100 && position.y >= 0 && position.y <= 100) {
      return [
        clamp((position.x / 100 - 0.5) * room.dimensions.width, -room.dimensions.width / 2 + dimensions.width / 2, room.dimensions.width / 2 - dimensions.width / 2),
        dimensions.height / 2,
        clamp((position.y / 100 - 0.5) * room.dimensions.depth, -room.dimensions.depth / 2 + dimensions.depth / 2, room.dimensions.depth / 2 - dimensions.depth / 2),
      ];
    }
  }

  if (category === 'sofa') return [0, dimensions.height / 2, -room.dimensions.depth * 0.28];
  if (category === 'coffee-table') return [0, dimensions.height / 2, 0];
  if (category === 'rug') return [0, 0.015, -room.dimensions.depth * 0.05];
  if (category === 'floor-lamp') return [-room.dimensions.width * 0.35, dimensions.height / 2, -room.dimensions.depth * 0.32];
  if (category === 'tv-stand') return [0, dimensions.height / 2, room.dimensions.depth * 0.32];

  return [0, dimensions.height / 2, 0];
}

function getRotation(asset: Asset) {
  const value = (asset as Asset & { rotation?: number }).rotation;
  return typeof value === 'number' ? value : 0;
}

export function FurniturePrimitive3D({ asset, room, selected, onSelect }: FurniturePrimitive3DProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const category = normalizeCategory(asset);
  const dimensions = useMemo(() => getAssetDimensionsM(asset, room), [asset, room]);
  const position = useMemo(() => getDefault3DPosition(asset, room, dimensions), [asset, room, dimensions]);
  const rotation = getRotation(asset);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(asset.id);
  };

  const primitiveProps = { dimensions, selected };

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onClick={handleClick}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {category === 'sofa' && <SofaPrimitive {...primitiveProps} />}
      {category === 'coffee-table' && <CoffeeTablePrimitive {...primitiveProps} />}
      {category === 'floor-lamp' && <FloorLampPrimitive {...primitiveProps} />}
      {category === 'rug' && <RugPrimitive {...primitiveProps} />}
      {category === 'tv-stand' && <TVStandPrimitive {...primitiveProps} />}
      {!['sofa', 'coffee-table', 'floor-lamp', 'rug', 'tv-stand'].includes(category) && (
        <mesh position={[0, dimensions.height / 2, 0]}>
          <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
        </mesh>
      )}

      {(hovered || selected) && (
        <Html position={[0, dimensions.height + 0.18, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="min-w-44 rounded-md border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-lg">
            <div className="font-semibold text-slate-900">{asset.name}</div>
            <div>{Math.round(dimensions.width * 100)} x {Math.round(dimensions.depth * 100)} x {Math.round(dimensions.height * 100)} cm</div>
            <div>Doorway: {asset.doorwayStatus ?? 'passed'}</div>
            <div>Fit: {asset.fitStatus ?? 'good'}</div>
          </div>
        </Html>
      )}
    </group>
  );
}
