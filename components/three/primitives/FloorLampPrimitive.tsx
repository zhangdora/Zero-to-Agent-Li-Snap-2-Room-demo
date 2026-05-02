'use client';

import type { ThreeElements } from '@react-three/fiber';

type PrimitiveProps = ThreeElements['group'] & {
  dimensions: { width: number; depth: number; height: number };
  selected?: boolean;
};

export function FloorLampPrimitive({ dimensions, selected, ...props }: PrimitiveProps) {
  const { width, depth, height } = dimensions;
  const radius = Math.max(width, depth) * 0.25;
  const poleHeight = height * 0.72;
  const shadeHeight = height * 0.18;

  return (
    <group {...props}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[radius, radius, 0.04, 32]} />
        <meshStandardMaterial color="#2f2f2f" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.04 + poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.018, 0.018, poleHeight, 18]} />
        <meshStandardMaterial color="#27272a" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.06 + poleHeight + shadeHeight / 2, 0]}>
        <cylinderGeometry args={[width * 0.36, width * 0.26, shadeHeight, 32]} />
        <meshStandardMaterial color="#f1dfbd" emissive="#fff3c4" emissiveIntensity={0.15} roughness={0.8} />
      </mesh>
      <pointLight position={[0, height * 0.88, 0]} intensity={0.35} distance={2.6} color="#fff3c4" />
      {selected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.08, height + 0.08, depth + 0.08]} />
          <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}
