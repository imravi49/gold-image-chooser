import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, X, Download } from "lucide-react";
import { db } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
import { GoldButton } from "@/components/GoldButton";

interface Photo {
  id: string;
  full_url: string;
  thumbnail_url: string;
  file_name: string;
}

interface Selection {
  photo_id: string;
  category: string;
  photos: Photo;
}

const ReviewSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPhotos, setSelectedPhotos] = useState<Selection[]>([]);
  const [laterPhotos, setLaterPhotos] = useState<Selection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'selected' | 'later'>('selected');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchSelections();
  }, []);

  const fetchSelections = async () => {
    try {
      const user = await db.auth.getCurrentUser();
      if (!user) return;

      // Get selections with photo data
      const selections = await db.selections.getByUser(user.uid);
      const photoIds = selections.map(s => s.photo_id);
      const allPhotos = await db.photos.getAll();
      const photosMap = new Map(allPhotos.map(p => [p.id, p]));
      
      const data = selections.map(sel => ({
        ...sel,
        photos: photosMap.get(sel.photo_id)
      })).filter(sel => sel.photos);

      const selected = data?.filter(s => s.category === 'selected') || [];
      const later = data?.filter(s => s.category === 'later') || [];
      
      setSelectedPhotos(selected as Selection[]);
      setLaterPhotos(later as Selection[]);
    } catch (error) {
      console.error('Error fetching selections:', error);
      toast({
        title: "Error",
        description: "Failed to load your selections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const moveToSelected = async (photoId: string) => {
    try {
      const user = await db.auth.getCurrentUser();
      if (!user) return;

      // Find the selection and update it
      const selections = await db.selections.getByUser(user.uid);
      const selection = selections.find(s => s.photo_id === photoId);
      if (selection) {
        await db.selections.delete(selection.id);
        await db.selections.create({
          user_id: user.uid,
          photo_id: photoId,
          category: 'selected'
        });
      }

      await fetchSelections();
      
      toast({
        title: "Moved to Selected",
        description: "Photo added to your final selection",
      });
    } catch (error) {
      console.error('Error moving photo:', error);
    }
  };

  const removeSelection = async (photoId: string) => {
    try {
      const user = await db.auth.getCurrentUser();
      if (!user) return;

      const selections = await db.selections.getByUser(user.uid);
      const selection = selections.find(s => s.photo_id === photoId);
      if (selection) {
        await db.selections.delete(selection.id);
      }

      await fetchSelections();
      
      toast({
        title: "Removed",
        description: "Photo removed from selection",
      });
    } catch (error) {
      console.error('Error removing photo:', error);
    }
  };

  const handleFinalize = () => {
    if (laterPhotos.length > 0) {
      setShowConfirm(true);
    } else {
      navigate('/finalize');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen cinematic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your selections...</p>
        </div>
      </div>
    );
  }

  const currentPhotos = activeTab === 'selected' ? selectedPhotos : laterPhotos;

  return (
    <div className="min-h-screen cinematic-gradient py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif mb-2 gold-text">
            Review Your Selection
          </h1>
          <p className="text-muted-foreground">
            {selectedPhotos.length} Selected • {laterPhotos.length} For Later
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setActiveTab('selected')}
            className={`px-6 py-3 rounded-xl font-semibold transition-smooth ${
              activeTab === 'selected'
                ? 'bg-primary text-white shadow-gold'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            <Heart className="inline-block w-5 h-5 mr-2" />
            Selected ({selectedPhotos.length})
          </button>
          <button
            onClick={() => setActiveTab('later')}
            className={`px-6 py-3 rounded-xl font-semibold transition-smooth ${
              activeTab === 'later'
                ? 'bg-primary text-white shadow-gold'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            <Clock className="inline-block w-5 h-5 mr-2" />
            Later ({laterPhotos.length})
          </button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {currentPhotos.map((selection) => (
            <div
              key={selection.photo_id}
              className="relative group rounded-xl overflow-hidden shadow-soft hover:shadow-gold transition-smooth"
            >
              <img
                src={selection.photos.thumbnail_url || selection.photos.full_url}
                alt={selection.photos.file_name}
                className="w-full aspect-square object-cover"
              />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {activeTab === 'later' && (
                  <button
                    onClick={() => moveToSelected(selection.photo_id)}
                    className="p-3 bg-primary rounded-full hover:scale-110 transition-transform"
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                )}
                <button
                  onClick={() => removeSelection(selection.photo_id)}
                  className="p-3 bg-destructive rounded-full hover:scale-110 transition-transform"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentPhotos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {activeTab === 'selected' 
                ? "No photos selected yet"
                : "No photos marked for later"}
            </p>
            <GoldButton onClick={() => navigate('/gallery')}>
              Back to Gallery
            </GoldButton>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <GoldButton
            variant="outline"
            onClick={() => navigate('/gallery')}
          >
            Back to Gallery
          </GoldButton>
          
          {selectedPhotos.length > 0 && (
            <GoldButton onClick={handleFinalize}>
              Continue to Finalize
            </GoldButton>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl p-8 max-w-md w-full shadow-gold animate-scale-in">
              <h2 className="text-2xl font-serif mb-4 gold-text">
                Skip "Later" Photos?
              </h2>
              <p className="text-muted-foreground mb-6">
                You have {laterPhotos.length} photos marked for later. 
                These won't be included in your final selection. Continue?
              </p>
              <div className="flex gap-4">
                <GoldButton
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                >
                  Go Back
                </GoldButton>
                <GoldButton
                  onClick={() => navigate('/finalize')}
                  className="flex-1"
                >
                  Finalize Now
                </GoldButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSelection;
