import { useState } from "react";
import { Heart, Clock, Download, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoldButton } from "@/components/GoldButton";

const Gallery = () => {
  const navigate = useNavigate();
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [laterPhotos, setLaterPhotos] = useState<Set<number>>(new Set());
  const selectionLimit = 150;

  // Demo photos - will be replaced with actual data
  const photos = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=800&q=80`,
    thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=400&q=80`
  }));

  const handleSelect = (id: number) => {
    if (selectedPhotos.has(id)) {
      setSelectedPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else if (selectedPhotos.size < selectionLimit) {
      setSelectedPhotos(prev => new Set(prev).add(id));
      setLaterPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleLater = (id: number) => {
    if (laterPhotos.has(id)) {
      setLaterPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setLaterPhotos(prev => new Set(prev).add(id));
      setSelectedPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen cinematic-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/hero")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-4">
              <Badge variant={selectedPhotos.size >= selectionLimit ? "destructive" : "default"} className="text-sm">
                <Heart className="w-4 h-4 mr-1" />
                Selected: {selectedPhotos.size} / {selectionLimit}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />
                Later: {laterPhotos.size}
              </Badge>
            </div>

            <GoldButton
              onClick={() => navigate("/finalize")}
              disabled={selectedPhotos.size === 0}
              className="text-sm px-6 py-2"
            >
              Finalize Selection
            </GoldButton>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-xl overflow-hidden shadow-card hover:shadow-gold transition-all duration-300 cursor-pointer"
            >
              {/* Photo */}
              <img
                src={photo.thumbnail}
                alt={`Photo ${photo.id + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
                  <button
                    onClick={() => handleSelect(photo.id)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      selectedPhotos.has(photo.id)
                        ? "bg-primary text-white"
                        : "bg-white/90 text-foreground hover:bg-white"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 mx-auto ${
                        selectedPhotos.has(photo.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleLater(photo.id)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      laterPhotos.has(photo.id)
                        ? "bg-secondary text-foreground"
                        : "bg-white/90 text-foreground hover:bg-white"
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Selected Badge */}
              {selectedPhotos.has(photo.id) && (
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-gold">
                  <Heart className="w-4 h-4 text-white fill-current" />
                </div>
              )}

              {/* Later Badge */}
              {laterPhotos.has(photo.id) && (
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-soft">
                  <Clock className="w-4 h-4 text-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
