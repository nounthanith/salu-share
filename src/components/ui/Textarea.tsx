"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium opacity-80 ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none
            bg-background text-foreground border-foreground/10
            focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:opacity-40 min-h-[120px]
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
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
