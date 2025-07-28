"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export const SearchInput = ({
  placeholder = "Search...",
  onSearch,
  ...props
}: SearchInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-sm md:max-w-3xl"
    >
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 p-2 bg-gray-100 bg-opacity-20 rounded-md"
      >
        <Search size={21} />
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        {...props}
        className={`w-full pl-4 pr-11 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black ${
          props.className ?? ""
        }`}
      />
    </form>
  );
};
