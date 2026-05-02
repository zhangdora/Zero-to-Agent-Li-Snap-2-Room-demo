'use client';

import type { Room } from '@/lib/types';

type RoomShell3DProps = {
  room: Room;
};

function getDoor(room: Room) {
  return {
    width: room.door?.width ?? room.doorway?.width ?? 0.8,
    height: room.door?.height ?? room.doorway?.height ?? 2,
    position: room.door?.position ?? 'front',
  };
}

export function RoomShell3D({ room }: RoomShell3DProps) {
  const width = room.dimensions.width;
  const depth = room.dimensions.depth;
  const height = room.dimensions.height;
  const wallThickness = 0.06;
  const door = getDoor(room);
  const floorHeight = 0.04;

  return (
    <group>
      <mesh receiveShadow position={[0, -floorHeight / 2, 0]}>
        <boxGeometry args={[width, floorHeight, depth]} />
        <meshStandardMaterial color="#d8b98c" roughness={0.72} />
      </mesh>

      <gridHelper args={[Math.max(width, depth), Math.ceil(Math.max(width, depth)), '#b08c62', '#caa87e']} position={[0, 0.004, 0]} />

      <mesh receiveShadow position={[0, height / 2, -depth / 2 - wallThickness / 2]}>
        <boxGeometry args={[width + wallThickness * 2, height, wallThickness]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.78} />
      </mesh>

      <mesh receiveShadow position={[-width / 2 - wallThickness / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.78} />
      </mesh>

      <mesh receiveShadow position={[width / 2 + wallThickness / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.78} />
      </mesh>

      <DoorMarker roomWidth={width} roomDepth={depth} doorWidth={door.width} doorHeight={door.height} position={door.position} />
    </group>
  );
}

type DoorMarkerProps = {
  roomWidth: number;
  roomDepth: number;
  doorWidth: number;
  doorHeight: number;
  position: 'front' | 'back' | 'left' | 'right';
};

function DoorMarker({ roomWidth, roomDepth, doorWidth, doorHeight, position }: DoorMarkerProps) {
  const markerColor = '#7f1d1d';
  const doorWidthClamped = Math.min(doorWidth, position === 'left' || position === 'right' ? roomDepth * 0.55 : roomWidth * 0.55);

  if (position === 'left' || position === 'right') {
    const x = position === 'left' ? -roomWidth / 2 - 0.033 : roomWidth / 2 + 0.033;
    const rotationY = Math.PI / 2;

    return (
      <group>
        <mesh position={[x, doorHeight / 2, roomDepth * 0.18]} rotation={[0, rotationY, 0]}>
          <boxGeometry args={[doorWidthClamped, doorHeight, 0.012]} />
          <meshBasicMaterial color={markerColor} transparent opacity={0.22} />
        </mesh>
        <mesh position={[x, 0.018, roomDepth * 0.18]} rotation={[0, rotationY, 0]}>
          <boxGeometry args={[doorWidthClamped, 0.035, 0.04]} />
          <meshBasicMaterial color={markerColor} />
        </mesh>
      </group>
    );
  }

  const z = position === 'front' ? roomDepth / 2 - 0.015 : -roomDepth / 2 - 0.033;

  return (
    <group>
      <mesh position={[0, doorHeight / 2, z]}>
        <boxGeometry args={[doorWidthClamped, doorHeight, 0.012]} />
        <meshBasicMaterial color={markerColor} transparent opacity={0.22} />
      </mesh>
      <mesh position={[0, 0.018, z]}>
        <boxGeometry args={[doorWidthClamped, 0.035, 0.04]} />
        <meshBasicMaterial color={markerColor} />
      </mesh>
    </group>
  );
}
