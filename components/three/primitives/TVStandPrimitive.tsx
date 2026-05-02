'use client';

import type { ThreeElements } from '@react-three/fiber';

type PrimitiveProps = ThreeElements['group'] & {
  dimensions: { width: number; depth: number; height: number };
  selected?: boolean;
};

export function TVStandPrimitive({ dimensions, selected, ...props }: PrimitiveProps) {
  const { width, depth, height } = dimensions;
  const panelWidth = width / 3;

  return (
    <group {...props}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#9b6a3c" roughness={0.68} />
      </mesh>
      {[-1, 0, 1].map((slot) => (
        <mesh key={slot} position={[slot * panelWidth, height * 0.52, depth / 2 + 0.006]}>
          <boxGeometry args={[panelWidth - 0.035, height * 0.52, 0.012]} />
          <meshStandardMaterial color={slot === 0 ? '#7f5530' : '#b07a44'} roughness={0.72} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.24, 0]}>
        <boxGeometry args={[width * 0.42, 0.28, 0.04]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} />
      </mesh>
      {selected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.08, height + 0.56, depth + 0.08]} />
          <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}
