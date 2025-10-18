import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "3d" | "outline" | "ghost";
}

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, variant = "3d", children, ...props }, ref) => {
    const variants = {
      "3d": "btn-3d-gold",
      "outline": "border-2 border-primary text-primary hover:bg-primary hover:text-white transition-smooth px-8 py-4 rounded-xl font-semibold",
      "ghost": "text-primary hover:bg-primary/10 transition-smooth px-8 py-4 rounded-xl font-semibold"
    };

    return (
      <button
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GoldButton.displayName = "GoldButton";
