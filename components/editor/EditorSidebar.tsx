'use client';

import { cn } from '@/lib/utils';
import {
  Home,
  Image,
  Library,
  Armchair,
  Coffee,
  Boxes,
  Lamp,
  Square,
  Zap,
  Leaf,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';

export interface EditorSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onHoveredCategoryChange?: (category: string | null, event?: React.MouseEvent) => void;
}

const CATEGORIES = [
  { id: 'room', label: 'Room', icon: Home },
  { id: 'inspiration', label: 'Inspiration', icon: Image },
  { id: 'mylibrary', label: 'My Library', icon: Library },
  { id: 'seating', label: 'Seating', icon: Armchair },
  { id: 'tables', label: 'Tables', icon: Coffee },
  { id: 'storage', label: 'Storage', icon: Boxes },
  { id: 'lighting', label: 'Lighting', icon: Lamp },
  { id: 'rugs', label: 'Rugs', icon: Square },
  { id: 'decor', label: 'Decor', icon: Zap },
  { id: 'plants', label: 'Plants', icon: Leaf },
  { id: 'buy', label: 'Buy', icon: ShoppingBag },
  { id: 'checkout', label: 'Checkout', icon: CreditCard },
];

export function EditorSidebar({
  activeCategory,
  onCategoryChange,
  onHoveredCategoryChange,
}: EditorSidebarProps) {
  const handleMouseEnter = (categoryId: string, event: React.MouseEvent) => {
    onHoveredCategoryChange?.(categoryId, event);
  };

  const handleMouseLeave = () => {
    // Don't immediately clear - let parent handle the delay
    // onHoveredCategoryChange?.(null);
  };

  return (
    <aside
      className="fixed left-0 top-14 bottom-0 w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-2 z-30"
    >
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            onMouseEnter={(e) => handleMouseEnter(category.id, e)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              'w-12 h-12 rounded flex items-center justify-center transition-all',
              'hover:bg-sidebar-accent',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground'
            )}
            title={category.label}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </aside>
  );
}
