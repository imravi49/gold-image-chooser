import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Demo slideshow images - these will be replaced with actual photos from backend
  const slides = [
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
      title: "Your Beautiful Moments",
      tagline: "Select the memories you want to cherish forever"
    },
    {
      url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80",
      title: "Captured Perfection",
      tagline: "Every moment tells your unique story"
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80",
      title: "Timeless Memories",
      tagline: "Choose the images that mean the most to you"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Slideshow Background */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center animate-ken-burns"
              style={{
                backgroundImage: `url(${slide.url})`,
                animationDelay: `${index * 5}s`
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            {slides[currentSlide].title}
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            {slides[currentSlide].tagline}
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <GoldButton
              onClick={() => navigate("/gallery")}
              className="text-lg group"
            >
              Start Selection
              <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </GoldButton>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-3 pt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-12 bg-primary"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Brand Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-sm text-gray-300">
            Ravi Sharma Photo & Films
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
