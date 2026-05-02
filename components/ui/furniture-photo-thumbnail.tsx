'use client';

import { cn } from '@/lib/utils';

interface FurniturePhotoThumbnailProps {
  category: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FurniturePhotoThumbnail({
  category,
  name,
  size = 'md',
  className,
}: FurniturePhotoThumbnailProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const renderPhotoThumbnail = () => {
    // Each thumbnail represents a cropped section of the living room photo
    switch (category) {
      case 'sofa':
      case 'seating':
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 relative overflow-hidden shadow-inset">
            {/* Sofa fabric texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-amber-150 opacity-60" />
            {/* Sofa cushion folds */}
            <div className="absolute inset-1 border-b border-amber-300 opacity-40" />
            <div className="absolute inset-2 border-r border-amber-300 opacity-30" />
            {/* Soft shadow for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-200 opacity-30" />
          </div>
        );
      case 'coffee-table':
      case 'tables':
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-700 to-amber-900 relative overflow-hidden shadow-md">
            {/* Wood grain texture */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(180,140,100,.05)_25%,rgba(180,140,100,.05)_26%,transparent_27%,transparent_74%,rgba(180,140,100,.05)_75%,rgba(180,140,100,.05)_76%,transparent_77%,transparent)] opacity-40" />
            {/* Wood surface reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-amber-600 to-transparent opacity-40" />
            {/* Table depth shadow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-950 opacity-30" />
          </div>
        );
      case 'floor-lamp':
      case 'lighting':
        return (
          <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-amber-100 relative overflow-hidden">
            {/* Lamp shade - cream fabric */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3/5 h-2/5 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full shadow-md border border-yellow-300" />
            {/* Light glow */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2/5 h-1/4 bg-yellow-100 rounded-full blur-sm opacity-80" />
            {/* Lamp stand - dark metal */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1 h-2/3 bg-gray-700" />
            {/* Base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gray-600" />
            {/* Warm ambient */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-100 to-transparent opacity-30" />
          </div>
        );
      case 'rug':
      case 'rugs':
        return (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 relative overflow-hidden shadow-sm">
            {/* Rug weave/texture */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(100,80,60,.1)_49%,rgba(100,80,60,.1)_51%,transparent_52%)] opacity-50" />
            {/* Rug edge shadow */}
            <div className="absolute inset-0 border border-stone-400 opacity-30" />
            {/* Depth/fold */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-stone-400 opacity-20" />
            {/* Natural textile feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-300 to-transparent opacity-40" />
          </div>
        );
      case 'tv-stand':
      case 'storage':
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-700 to-amber-900 relative overflow-hidden shadow-lg">
            {/* Cabinet wood tone */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800 opacity-70" />
            {/* Door line - subtle */}
            <div className="absolute top-1/4 left-1/2 w-0.5 h-1/2 bg-amber-900 opacity-40" />
            {/* Cabinet depth shadow */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-600 to-amber-900 opacity-30" />
            {/* Shelf/surface highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-amber-500 opacity-50" />
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 relative overflow-hidden shadow-sm flex items-center justify-center">
            <span className="text-xs text-stone-400">{category}</span>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        'rounded-md border border-slate-200 overflow-hidden bg-white shadow-sm flex-shrink-0',
        className
      )}
      title={name}
    >
      {renderPhotoThumbnail()}
    </div>
  );
}
