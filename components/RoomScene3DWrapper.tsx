'use client';

import dynamic from 'next/dynamic';
import type { RoomScene3DProps } from './three/RoomScene3D';

const RoomScene3D = dynamic(
  () => import('./three/RoomScene3D').then((mod) => mod.RoomScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading 3D room preview...
      </div>
    ),
  }
);

export function RoomScene3DWrapper(props: RoomScene3DProps) {
  return <RoomScene3D {...props} />;
}
