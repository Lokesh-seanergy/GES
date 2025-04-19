"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "./input";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ placeholder = "Search...", onChange, className = "", value }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`relative w-full ${className}`}>
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="bg-gray-100 border-none rounded-full pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
