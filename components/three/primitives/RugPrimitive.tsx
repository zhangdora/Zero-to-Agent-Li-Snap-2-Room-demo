'use client';

import type { ThreeElements } from '@react-three/fiber';

type PrimitiveProps = ThreeElements['group'] & {
  dimensions: { width: number; depth: number; height: number };
  selected?: boolean;
};

export function RugPrimitive({ dimensions, selected, ...props }: PrimitiveProps) {
  const { width, depth } = dimensions;

  return (
    <group {...props}>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial color="#eadfcf" roughness={0.95} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0.024, 0]}>
        <boxGeometry args={[width * 0.92, 0.006, depth * 0.86]} />
        <meshStandardMaterial color="#f6efe6" roughness={0.95} transparent opacity={0.7} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[width + 0.08, 0.08, depth + 0.08]} />
          <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}
