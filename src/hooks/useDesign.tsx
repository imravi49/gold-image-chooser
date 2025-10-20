import { useEffect, useState } from 'react';
import { db } from '@/services/database';

export const useDesign = () => {
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDesign();
  }, []);

  const loadDesign = async () => {
    try {
      const designSettings = await db.adminSettings.get('design');
      if (designSettings?.value) {
        setDesign(designSettings.value);
        applyDesign(designSettings.value);
      }
    } catch (error) {
      console.error('Error loading design:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyDesign = (designData: any) => {
    const root = document.documentElement;
    
    if (designData.colors) {
      const { primaryColor, textColor, backgroundColor, secondaryColor } = designData.colors;
      
      // Convert hex to HSL for CSS variables
      if (primaryColor) {
        const hsl = hexToHSL(primaryColor);
        root.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      }
    }

    if (designData.fonts) {
      const { headingFont, bodyFont } = designData.fonts;
      if (headingFont) {
        root.style.setProperty('--font-heading', headingFont);
      }
      if (bodyFont) {
        root.style.setProperty('--font-body', bodyFont);
      }
    }
  };

  return { design, loading };
};

// Helper function to convert hex to HSL
function hexToHSL(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
