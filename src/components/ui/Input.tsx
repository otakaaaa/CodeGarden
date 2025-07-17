import { InputHTMLAttributes, forwardRef, useState } from "react";
import { mergeClassNames as cn } from "@/lib/utils";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: "default" | "filled" | "flushed" | "unstyled";
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = "default", 
    size = "md", 
    error,
    label,
    helperText,
    leftIcon,
    rightIcon,
    isInvalid,
    isRequired,
    type = "text",
    id,
    ...props 
  }, ref) => {
    const [, setIsFocused] = useState(false);
    const hasError = isInvalid || !!error;
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = "w-full transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      default: "border rounded-lg bg-white focus:ring-2 focus:ring-offset-1",
      filled: "border-0 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-offset-1",
      flushed: "border-0 border-b-2 rounded-none bg-transparent focus:ring-0 focus:border-b-2",
      unstyled: "border-0 bg-transparent focus:ring-0",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    const getVariantClasses = () => {
      const base = variants[variant];
      
      if (hasError) {
        switch (variant) {
          case "default":
          case "filled":
            return `${base} border-red-300 focus:border-red-300 focus:ring-red-200`;
          case "flushed":
            return `${base} border-red-500 focus:border-red-500`;
          default:
            return base;
        }
      }

      switch (variant) {
        case "default":
        case "filled":
          return `${base} border-gray-300 focus:border-green-300 focus:ring-green-200`;
        case "flushed":
          return `${base} border-gray-300 focus:border-green-500`;
        default:
          return base;
      }
    };

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            baseClasses,
            getVariantClasses(),
            sizes[size],
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );

    if (label || helperText || error) {
      return (
        <div className="space-y-1">
          {label && (
            <label 
              htmlFor={inputId}
              className={cn(
                "block text-sm font-medium",
                hasError ? "text-red-700" : "text-gray-700"
              )}
            >
              {label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {inputElement}
          {(helperText || error) && (
            <p className={cn(
              "text-sm",
              hasError ? "text-red-600" : "text-gray-500"
            )}>
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    return inputElement;
  }
);

Input.displayName = "Input";

export default Input;