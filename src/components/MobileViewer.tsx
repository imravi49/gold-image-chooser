import { useState, useEffect, useCallback } from "react";
import { X, Heart, Clock, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

interface Photo {
  id: string;
  full_url: string;
  file_name: string;
}

interface MobileViewerProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onSelect: (photoId: string) => void;
  onLater: (photoId: string) => void;
  onNavigate: (index: number) => void;
  isSelected: (photoId: string) => boolean;
  isLater: (photoId: string) => boolean;
}

export const MobileViewer = ({
  photos,
  currentIndex,
  onClose,
  onSelect,
  onLater,
  onNavigate,
  isSelected,
  isLater
}: MobileViewerProps) => {
  const currentPhoto = photos[currentIndex];
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) onNavigate(currentIndex - 1);
          break;
        case 'ArrowRight':
          if (currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
          break;
        case 'ArrowUp':
          onSelect(currentPhoto.id);
          break;
        case 'ArrowDown':
          onLater(currentPhoto.id);
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, currentPhoto, photos.length, onNavigate, onSelect, onLater, onClose]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < photos.length - 1) {
        onNavigate(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    },
    onSwipedUp: (e) => {
      // Only trigger if vertical swipe is dominant
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        onSelect(currentPhoto.id);
      }
    },
    onSwipedDown: (e) => {
      // Only trigger if vertical swipe is dominant
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        onLater(currentPhoto.id);
      }
    },
    trackMouse: true,
    trackTouch: true,
    delta: 50
  });

  const selected = isSelected(currentPhoto.id);
  const later = isLater(currentPhoto.id);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <span className="text-white font-medium">
            {currentIndex + 1} / {photos.length}
          </span>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = currentPhoto.full_url;
              link.download = currentPhoto.file_name;
              link.click();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Download className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div
        {...swipeHandlers}
        className="flex-1 flex items-center justify-center p-4 relative"
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        <img
          src={currentPhoto.full_url}
          alt={currentPhoto.file_name}
          className="max-w-full max-h-full object-contain"
          style={{ userSelect: 'none' }}
        />

        {/* Navigation arrows (desktop) */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        {currentIndex < photos.length - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
        {/* Swipe hint */}
        <div className="text-center text-white/60 text-sm mb-4 md:hidden">
          Swipe ↑ Select • ↓ Later • ← → Navigate
        </div>

        <div className="flex gap-4 justify-center max-w-md mx-auto">
          <button
            onClick={() => onLater(currentPhoto.id)}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-smooth ${
              later
                ? 'bg-amber-500 text-white shadow-gold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Clock className="w-5 h-5 inline-block mr-2" />
            Later
          </button>
          
          <button
            onClick={() => onSelect(currentPhoto.id)}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-smooth ${
              selected
                ? 'gold-gradient text-white shadow-gold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`w-5 h-5 inline-block mr-2 ${selected ? 'fill-current' : ''}`} />
            Select
          </button>
        </div>

        {/* Desktop keyboard hints */}
        <div className="hidden md:flex justify-center gap-6 text-white/60 text-xs mt-4">
          <span>← → Navigate</span>
          <span>↑ Select</span>
          <span>↓ Later</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};
