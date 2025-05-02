"use client";

import React, { useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { Plus } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  value?: string;
  showNewButton?: boolean;
  onNewClick?: () => void;
}

export function SearchBar({ placeholder = "Search for shows, exhibitors, etc.", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Collapse on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div
      className={`relative flex flex-row-reverse items-center ${className}`}
      style={{ minWidth: isOpen ? 256 : 40, transition: 'min-width 0.2s' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Search icon button (always visible, right-aligned) */}
      <button
        className={`h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 shadow transition-all duration-200 focus:outline-none z-10 pointer-events-none`}
        aria-label="Open search"
        tabIndex={-1}
        type="button"
      >
        <Search className="w-5 h-5" />
      </button>
      {/* Input expands to the left of the icon */}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`absolute right-0 ${isOpen ? 'w-64 pl-4 pr-12 opacity-100' : 'w-0 opacity-0'} py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-white focus:ring-0 focus:outline-none shadow-sm transition-all duration-200 text-base placeholder-gray-400 z-0`}
        style={{ transition: 'width 0.2s, opacity 0.2s' }}
        onBlur={() => setIsOpen(false)}
        tabIndex={isOpen ? 0 : -1}
      />
    </div>
  );
}

const SearchBarOld = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      placeholder = "Search...",
      onChange,
      onClear,
      className = "",
      value,
      showNewButton = false,
      onNewClick,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="relative flex-1">
          <Input
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className="pr-20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {value && onClear && (
              <button
                onClick={onClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <Search className="h-4 w-4 text-gray-600" />
          </div>
        </div>
        {showNewButton && (
          <Button
            onClick={onNewClick}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Show
          </Button>
        )}
      </div>
    );
  }
);

SearchBarOld.displayName = "SearchBar";

export { SearchBarOld };
