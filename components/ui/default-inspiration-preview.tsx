'use client';

import { cn } from '@/lib/utils';

interface DefaultInspirationPreviewProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function DefaultInspirationPreview({
  size = 'md',
  className,
  showLabel = true,
}: DefaultInspirationPreviewProps) {
  const sizeClasses = {
    sm: 'w-32 h-24',
    md: 'w-96 h-64',
    lg: 'w-full max-w-2xl h-96',
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        'rounded-lg border border-border overflow-hidden bg-gradient-to-b from-blue-100 via-amber-50 to-green-100 relative',
        className
      )}
    >
      {/* SVG rendering of a living room scene */}
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Background - wall */}
        <rect width="400" height="300" fill="#F5E6D3" />

        {/* Floor */}
        <rect y="200" width="400" height="100" fill="#E8D4B8" />

        {/* Door on left wall */}
        <rect x="20" y="100" width="50" height="100" fill="#D2691E" opacity="0.8" />
        <circle cx="65" cy="150" r="3" fill="#FFD700" />

        {/* Window on top right */}
        <rect x="280" y="30" width="80" height="60" fill="#87CEEB" opacity="0.4" />
        <line x1="320" y1="30" x2="320" y2="90" stroke="#87CEEB" strokeWidth="2" />
        <line x1="280" y1="60" x2="360" y2="60" stroke="#87CEEB" strokeWidth="2" />

        {/* Wall art - simple rectangle */}
        <rect x="120" y="40" width="60" height="80" fill="#D4A574" />
        <rect x="125" y="45" width="50" height="70" fill="#C4957A" opacity="0.6" />

        {/* Rug */}
        <ellipse cx="200" cy="210" rx="110" ry="50" fill="#E8D4B8" opacity="0.7" />
        <rect x="120" y="190" width="160" height="60" fill="#E8D4B8" opacity="0.7" />
        <rect x="125" y="195" width="150" height="50" fill="none" stroke="#D4C5B9" strokeWidth="1" strokeDasharray="3,3" />

        {/* Sofa */}
        <g>
          <rect x="80" y="160" width="120" height="50" rx="4" fill="#D4A574" />
          <rect x="80" y="158" width="120" height="4" fill="#C9915C" />
          <circle cx="90" cy="180" r="2" fill="#8B6F47" />
          <circle cx="190" cy="180" r="2" fill="#8B6F47" />
        </g>

        {/* Coffee table */}
        <g>
          <rect x="210" y="175" width="90" height="55" rx="2" fill="#A0826D" />
          <rect x="218" y="182" width="74" height="40" fill="#B8956A" opacity="0.8" />
          <rect x="205" y="225" width="6" height="20" fill="#8B6F47" />
          <rect x="289" y="225" width="6" height="20" fill="#8B6F47" />
        </g>

        {/* Floor lamp */}
        <g>
          <rect x="310" y="80" width="6" height="140" fill="#D4AF37" opacity="0.6" />
          <ellipse cx="313" cy="90" rx="16" ry="12" fill="#F5E6D3" />
          <path d="M 300 100 Q 313 92 326 100" stroke="#E8D4B8" strokeWidth="1" fill="none" />
          <rect x="305" y="215" width="16" height="25" fill="#8B6F47" />
          <rect x="298" y="238" width="30" height="2" fill="#5C4033" />
        </g>

        {/* TV stand */}
        <g>
          <rect x="20" y="220" width="70" height="12" rx="1" fill="#A0826D" />
          <rect x="28" y="232" width="54" height="18" fill="#B8956A" />
          <rect x="40" y="245" width="30" height="2" fill="#8B6F47" />
        </g>
      </svg>

      {showLabel && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
          <p className="text-white text-sm font-medium">Default Living Room Inspiration</p>
        </div>
      )}
    </div>
  );
}
