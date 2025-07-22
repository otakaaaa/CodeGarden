import { HTMLAttributes } from "react";
import { mergeClassNames as cn } from "@/lib/utils";

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "body" | "caption" | "subtitle" | "title" | "heading";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "secondary" | "success" | "warning" | "danger";
  align?: "left" | "center" | "right" | "justify";
}

const Text = ({ 
  className, 
  as: Component = "p", 
  variant = "body", 
  size, 
  weight = "normal", 
  color = "default",
  align = "left",
  children, 
  ...props 
}: TextProps) => {
    const baseClasses = "transition-colors";
    
    const variants = {
      body: "text-base leading-relaxed",
      caption: "text-sm leading-normal",
      subtitle: "text-lg leading-relaxed font-medium",
      title: "text-xl leading-tight font-semibold",
      heading: "text-2xl leading-tight font-bold",
    };

    const sizes = {
      xs: "text-xs",
      sm: "text-sm", 
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    };

    const weights = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold", 
      bold: "font-bold",
    };

    const colors = {
      default: "text-gray-900",
      muted: "text-gray-600",
      primary: "text-green-600",
      secondary: "text-blue-600",
      success: "text-green-600",
      warning: "text-yellow-600",
      danger: "text-red-600",
    };

    const alignments = {
      left: "text-left",
      center: "text-center", 
      right: "text-right",
      justify: "text-justify",
    };

    // sizeが指定されている場合はvariantよりも優先
    const textSize = size ? sizes[size] : variants[variant];

  return (
    <Component
      className={cn(
        baseClasses,
        textSize,
        weights[weight],
        colors[color],
        alignments[align],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;