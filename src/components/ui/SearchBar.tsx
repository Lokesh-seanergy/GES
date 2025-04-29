"use client";

import React from "react";
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

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
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

SearchBar.displayName = "SearchBar";

export { SearchBar };
