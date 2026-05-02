'use client';

import { cn } from '@/lib/utils';

interface DefaultInspirationPhotoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DefaultInspirationPhoto({
  size = 'md',
  className,
}: DefaultInspirationPhotoProps) {
  const sizeClasses = {
    sm: 'w-48 h-36',
    md: 'w-full max-w-2xl h-72',
    lg: 'w-full max-w-4xl h-96',
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        'rounded-lg border border-slate-200 overflow-hidden shadow-md bg-gradient-to-br from-slate-100 to-slate-50',
        className
      )}
    >
      {/* Photo-realistic living room mock using HTML/CSS gradients and overlays */}
      <div className="w-full h-full relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
        {/* Wall with soft texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50" />

        {/* Window effect - top right with soft light */}
        <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-gradient-to-b from-blue-100 to-transparent opacity-60" />

        {/* Soft shadow for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-200 opacity-20" />

        {/* Floor area - warm wood tone */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-b from-amber-100 to-orange-100" />

        {/* Rug - large neutral backdrop */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-2/5 bg-gradient-to-b from-stone-200 to-stone-300 rounded-sm shadow-lg opacity-80" />

        {/* Sofa - beige, positioned on rug */}
        <div className="absolute bottom-32 left-1/4 w-1/2 h-24 bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg shadow-xl border border-amber-300" >
          {/* Sofa pillows effect */}
          <div className="absolute inset-0 flex gap-2 p-2">
            <div className="flex-1 bg-gradient-to-br from-amber-50 to-amber-100 rounded-md shadow-md" />
            <div className="flex-1 bg-gradient-to-br from-amber-50 to-amber-100 rounded-md shadow-md" />
          </div>
        </div>

        {/* Coffee table - oak wood, on the rug */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-32 h-20 bg-gradient-to-br from-amber-700 to-amber-800 rounded-sm shadow-lg" >
          <div className="absolute inset-1 bg-gradient-to-br from-amber-600 to-amber-700 rounded-sm" />
        </div>

        {/* Floor lamp - warm light fixture, corner right */}
        <div className="absolute bottom-20 right-1/4 w-12 h-48">
          {/* Lamp stand */}
          <div className="absolute bottom-0 w-2 h-32 bg-gray-700 mx-auto left-1/2 -translate-x-1/2" />
          {/* Lamp shade */}
          <div className="absolute top-0 w-16 h-16 -left-2 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full shadow-lg border-2 border-yellow-300" />
          {/* Light glow effect */}
          <div className="absolute top-4 w-12 h-12 -left-1 bg-yellow-200 rounded-full blur-lg opacity-60" />
        </div>

        {/* TV stand - low, oak wood */}
        <div className="absolute bottom-12 right-1/4 w-40 h-16 bg-gradient-to-br from-amber-700 to-amber-800 rounded-sm shadow-lg" >
          <div className="absolute inset-2 bg-gradient-to-b from-amber-600 to-gray-900 rounded-sm" />
          {/* TV screen suggestion */}
          <div className="absolute inset-3 top-2 h-6 bg-gray-900 rounded-sm" />
        </div>

        {/* Picture frame on wall - subtle */}
        <div className="absolute top-1/4 left-1/3 w-20 h-24 bg-gradient-to-br from-stone-400 to-stone-500 rounded-sm shadow-md" />

        {/* Overall light and shadow effect */}
        <div className="absolute inset-0 bg-radial-gradient-to-center opacity-10" style={{
          background: 'radial-gradient(ellipse at 75% 10%, rgba(255, 200, 100, 0.3), transparent 60%)'
        }} />
      </div>
    </div>
  );
}
