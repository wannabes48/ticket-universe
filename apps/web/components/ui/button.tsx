import React from "react";
import { cn } from "@/lib/utils";
import { CustomSpinner } from "./custom-spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      outline: "border-2 border-border bg-transparent hover:bg-muted/50",
      ghost: "bg-transparent hover:bg-muted/50",
      gradient: "bg-gradient-to-r from-cyan-500 to-orange-500 text-white hover:from-cyan-400 hover:to-orange-400 shadow-lg hover:shadow-xl",
    };

    const sizes = {
      default: "px-6 py-3 rounded-xl",
      sm: "px-4 py-2 rounded-lg text-sm",
      lg: "px-10 py-4 rounded-full text-lg",
      icon: "w-10 h-10 rounded-full flex items-center justify-center p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <CustomSpinner className="w-6 h-6" />
          </div>
        )}
        <span className={cn("inline-flex items-center gap-2", isLoading && "opacity-0")}>
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";
