'use client';

import type { ThreeElements } from '@react-three/fiber';

type PrimitiveProps = ThreeElements['group'] & {
  dimensions: { width: number; depth: number; height: number };
  selected?: boolean;
};

export function CoffeeTablePrimitive({ dimensions, selected, ...props }: PrimitiveProps) {
  const { width, depth, height } = dimensions;
  const topHeight = Math.max(height * 0.12, 0.04);
  const legHeight = Math.max(height - topHeight, 0.12);
  const legSize = Math.max(Math.min(width, depth) * 0.08, 0.035);
  const legX = width / 2 - legSize;
  const legZ = depth / 2 - legSize;

  return (
    <group {...props}>
      <mesh position={[0, legHeight + topHeight / 2, 0]}>
        <boxGeometry args={[width, topHeight, depth]} />
        <meshStandardMaterial color="#a97843" roughness={0.62} />
      </mesh>
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}-${z}`} position={[x * legX, legHeight / 2, z * legZ]}>
            <boxGeometry args={[legSize, legHeight, legSize]} />
            <meshStandardMaterial color="#6f4e2c" roughness={0.7} />
          </mesh>
        ))
      )}
      {selected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.08, height + 0.08, depth + 0.08]} />
          <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}
