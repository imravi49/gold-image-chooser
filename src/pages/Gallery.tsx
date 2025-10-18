import { useState, useEffect } from "react";
import { Heart, Clock, ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoldButton } from "@/components/GoldButton";
import { MobileViewer } from "@/components/MobileViewer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  full_url: string;
  thumbnail_url: string;
  file_name: string;
}

const Gallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [laterPhotos, setLaterPhotos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const selectionLimit = 150;

  useEffect(() => {
    fetchPhotos();
    fetchSelections();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSelections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('selections')
        .select('photo_id, category')
        .eq('user_id', user.id);

      if (error) throw error;

      const selected = new Set(
        data?.filter(s => s.category === 'selected').map(s => s.photo_id) || []
      );
      const later = new Set(
        data?.filter(s => s.category === 'later').map(s => s.photo_id) || []
      );

      setSelectedPhotos(selected);
      setLaterPhotos(later);
    } catch (error) {
      console.error('Error fetching selections:', error);
    }
  };

  const handleSelect = async (photoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (selectedPhotos.has(photoId)) {
        // Unselect
        await supabase
          .from('selections')
          .delete()
          .eq('photo_id', photoId)
          .eq('user_id', user.id);

        setSelectedPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
      } else {
        // Check limit
        if (selectedPhotos.size >= selectionLimit) {
          toast({
            title: "Selection Limit Reached",
            description: `You can only select ${selectionLimit} photos. Please remove some to add more.`,
            variant: "destructive"
          });
          return;
        }

        // Add selection
        await supabase
          .from('selections')
          .upsert({
            user_id: user.id,
            photo_id: photoId,
            category: 'selected'
          });

        setSelectedPhotos(prev => new Set(prev).add(photoId));
        setLaterPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });

        // Log activity
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action: 'photo_selected',
          details: { photo_id: photoId }
        });
      }
    } catch (error) {
      console.error('Error toggling selection:', error);
      toast({
        title: "Error",
        description: "Failed to update selection",
        variant: "destructive"
      });
    }
  };

  const handleLater = async (photoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (laterPhotos.has(photoId)) {
        // Remove from later
        await supabase
          .from('selections')
          .delete()
          .eq('photo_id', photoId)
          .eq('user_id', user.id);

        setLaterPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
      } else {
        // Add to later
        await supabase
          .from('selections')
          .upsert({
            user_id: user.id,
            photo_id: photoId,
            category: 'later'
          });

        setLaterPhotos(prev => new Set(prev).add(photoId));
        setSelectedPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling later:', error);
    }
  };

  const openViewer = (index: number) => {
    setCurrentPhotoIndex(index);
    setViewerOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen cinematic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cinematic-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
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
                {selectedPhotos.size} / {selectionLimit}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />
                Later: {laterPhotos.size}
              </Badge>
            </div>

            <div className="flex gap-2">
              <GoldButton
                variant="outline"
                onClick={() => navigate("/review")}
                disabled={selectedPhotos.size === 0 && laterPhotos.size === 0}
                className="text-sm px-4 py-2"
              >
                <Eye className="w-4 h-4 mr-2" />
                Review
              </GoldButton>
              <GoldButton
                onClick={() => navigate("/finalize")}
                disabled={selectedPhotos.size === 0}
                className="text-sm px-4 py-2"
              >
                Finalize
              </GoldButton>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No photos available yet</p>
            <p className="text-sm text-muted-foreground">Photos will appear here once uploaded by admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-card hover:shadow-gold transition-all duration-300 cursor-pointer"
                onClick={() => openViewer(index)}
              >
                {/* Photo */}
                <img
                  src={photo.thumbnail_url || photo.full_url}
                  alt={photo.file_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(photo.id);
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLater(photo.id);
                      }}
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
        )}
      </div>

      {/* Mobile Viewer */}
      {viewerOpen && (
        <MobileViewer
          photos={photos}
          currentIndex={currentPhotoIndex}
          onClose={() => setViewerOpen(false)}
          onSelect={handleSelect}
          onLater={handleLater}
          onNavigate={setCurrentPhotoIndex}
          isSelected={(id) => selectedPhotos.has(id)}
          isLater={(id) => laterPhotos.has(id)}
        />
      )}
    </div>
  );
};

export default Gallery;
