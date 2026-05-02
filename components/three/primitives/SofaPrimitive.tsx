'use client';

import type { ThreeElements } from '@react-three/fiber';

type PrimitiveProps = ThreeElements['group'] & {
  dimensions: { width: number; depth: number; height: number };
  selected?: boolean;
};

const fabric = '#cdb79e';
const lightFabric = '#e2d2bf';
const highlight = '#f59e0b';

export function SofaPrimitive({ dimensions, selected, ...props }: PrimitiveProps) {
  const { width, depth, height } = dimensions;
  const baseHeight = height * 0.28;
  const baseDepth = depth * 0.75;
  const backHeight = height * 0.65;
  const backDepth = depth * 0.12;
  const armWidth = Math.max(width * 0.08, 0.08);
  const armHeight = height * 0.45;
  const cushionCount = width > 1.8 ? 3 : 2;
  const cushionWidth = (width - armWidth * 2 - 0.06) / cushionCount;

  return (
    <group {...props}>
      <mesh position={[0, baseHeight / 2, 0.04]}>
        <boxGeometry args={[width, baseHeight, baseDepth]} />
        <meshStandardMaterial color={fabric} roughness={0.85} />
      </mesh>

      <mesh position={[0, baseHeight + backHeight / 2, -depth * 0.36]}>
        <boxGeometry args={[width, backHeight, backDepth]} />
        <meshStandardMaterial color={fabric} roughness={0.85} />
      </mesh>

      <mesh position={[-width / 2 + armWidth / 2, baseHeight + armHeight / 2, 0.04]}>
        <boxGeometry args={[armWidth, armHeight, baseDepth]} />
        <meshStandardMaterial color={fabric} roughness={0.85} />
      </mesh>

      <mesh position={[width / 2 - armWidth / 2, baseHeight + armHeight / 2, 0.04]}>
        <boxGeometry args={[armWidth, armHeight, baseDepth]} />
        <meshStandardMaterial color={fabric} roughness={0.85} />
      </mesh>

      {Array.from({ length: cushionCount }).map((_, index) => {
        const x = -width / 2 + armWidth + cushionWidth / 2 + index * cushionWidth;
        return (
          <mesh key={index} position={[x, baseHeight + 0.025, depth * 0.06]}>
            <boxGeometry args={[cushionWidth - 0.025, 0.05, baseDepth * 0.78]} />
            <meshStandardMaterial color={lightFabric} roughness={0.9} />
          </mesh>
        );
      })}

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * width * 0.22, baseHeight + backHeight * 0.45, -depth * 0.25]}>
          <boxGeometry args={[width * 0.2, height * 0.28, depth * 0.08]} />
          <meshStandardMaterial color="#efe4d4" roughness={0.95} />
        </mesh>
      ))}

      {selected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.08, height + 0.08, depth + 0.08]} />
          <meshBasicMaterial color={highlight} wireframe transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}
