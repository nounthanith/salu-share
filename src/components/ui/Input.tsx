"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium opacity-80 ml-1">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all outline-none
            bg-background text-foreground border-foreground/10
            focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:opacity-70
            ${error ? "border-red-500/50 focus:border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
