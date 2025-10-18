import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star, ExternalLink } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const Finalize = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFinalized, setIsFinalized] = useState(false);
  const [ratings, setRatings] = useState({
    overall: 0,
    experience: 0,
    quality: 0
  });
  const [comments, setComments] = useState("");

  const handleRating = (category: 'overall' | 'experience' | 'quality', rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleFinalize = async () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C2994A', '#D4AF37', '#FFD700']
    });

    // TODO: Save feedback to backend
    
    setIsFinalized(true);
    
    toast({
      title: "Selection Finalized! 🎉",
      description: "Your photographer has been notified of your selections.",
    });
  };

  const RatingStars = ({ 
    value, 
    onChange 
  }: { 
    value: number; 
    onChange: (rating: number) => void 
  }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-all hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              star <= value 
                ? "fill-primary text-primary" 
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );

  if (isFinalized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="p-8 rounded-full gold-gradient shadow-gold">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-serif text-white">
            Thank You!
          </h1>

          {/* Message */}
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            Your photo selection has been finalized. We've notified your photographer 
            and they'll start working on your beautiful memories.
          </p>

          {/* CTA */}
          <div className="pt-8">
            <a
              href="https://ravisharmaphotofilms.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GoldButton className="group">
                Visit Main Site
                <ExternalLink className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </GoldButton>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cinematic-gradient py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card shadow-soft rounded-2xl p-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif mb-2 gold-text">
              Finalize Your Selection
            </h1>
            <p className="text-muted-foreground">
              Share your feedback before finalizing
            </p>
          </div>

          {/* Feedback Form */}
          <div className="space-y-8">
            {/* Overall Rating */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Overall Experience</Label>
              <RatingStars
                value={ratings.overall}
                onChange={(rating) => handleRating('overall', rating)}
              />
            </div>

            {/* Selection Experience */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Selection Process</Label>
              <RatingStars
                value={ratings.experience}
                onChange={(rating) => handleRating('experience', rating)}
              />
            </div>

            {/* Photo Quality */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Photo Quality</Label>
              <RatingStars
                value={ratings.quality}
                onChange={(rating) => handleRating('quality', rating)}
              />
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <Label htmlFor="comments" className="text-lg font-medium">
                Additional Comments
              </Label>
              <Textarea
                id="comments"
                placeholder="Share your thoughts about the photos, event, or selection process..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <GoldButton
                variant="outline"
                onClick={() => navigate("/gallery")}
                className="flex-1"
              >
                Back to Gallery
              </GoldButton>
              <GoldButton
                onClick={handleFinalize}
                disabled={!ratings.overall || !ratings.experience || !ratings.quality}
                className="flex-1"
              >
                Finalize Selection
              </GoldButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finalize;
