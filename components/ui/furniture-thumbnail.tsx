'use client';

import { cn } from '@/lib/utils';

interface FurnitureThumbnailProps {
  category: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FurnitureThumbnail({
  category,
  name,
  size = 'md',
  className,
}: FurnitureThumbnailProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const renderFurnitureShape = () => {
    switch (category) {
      case 'sofa':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <rect x="10" y="10" width="80" height="40" rx="4" fill="#D4A574" />
            <rect x="10" y="8" width="80" height="4" fill="#C9915C" />
            <circle cx="15" cy="35" r="2" fill="#8B6F47" />
            <circle cx="85" cy="35" r="2" fill="#8B6F47" />
          </svg>
        );
      case 'coffee-table':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <rect x="20" y="15" width="60" height="35" rx="2" fill="#A0826D" />
            <rect x="25" y="20" width="50" height="25" fill="#B8956A" opacity="0.8" />
            <rect x="15" y="45" width="8" height="12" fill="#8B6F47" />
            <rect x="77" y="45" width="8" height="12" fill="#8B6F47" />
          </svg>
        );
      case 'floor-lamp':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="45" y="5" width="10" height="50" fill="#D4AF37" opacity="0.6" />
            <ellipse cx="50" cy="15" rx="18" ry="12" fill="#F5E6D3" />
            <path d="M 35 25 Q 50 18 65 25" stroke="#E8D4B8" strokeWidth="1" fill="none" />
            <rect x="40" y="55" width="20" height="30" fill="#8B6F47" />
            <rect x="30" y="82" width="40" height="3" fill="#5C4033" />
          </svg>
        );
      case 'rug':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="15" y="25" width="70" height="50" rx="2" fill="#E8D4B8" opacity="0.7" />
            <rect x="18" y="28" width="64" height="44" fill="none" stroke="#D4C5B9" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="25" cy="35" r="1" fill="#D4A574" opacity="0.5" />
            <circle cx="75" cy="35" r="1" fill="#D4A574" opacity="0.5" />
            <circle cx="25" cy="65" r="1" fill="#D4A574" opacity="0.5" />
            <circle cx="75" cy="65" r="1" fill="#D4A574" opacity="0.5" />
          </svg>
        );
      case 'tv-stand':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <rect x="15" y="15" width="70" height="12" rx="1" fill="#A0826D" />
            <rect x="20" y="27" width="60" height="20" fill="#B8956A" />
            <rect x="35" y="48" width="30" height="2" fill="#8B6F47" />
            <rect x="40" y="50" width="8" height="8" fill="#5C4033" />
            <rect x="52" y="50" width="8" height="8" fill="#5C4033" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="20" y="20" width="60" height="60" fill="#E0E0E0" opacity="0.3" />
          </svg>
        );
    }
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        'rounded-lg border border-border bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {renderFurnitureShape()}
      {name && size === 'lg' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white text-xs p-1 text-center truncate">
          {name}
        </div>
      )}
    </div>
  );
}
