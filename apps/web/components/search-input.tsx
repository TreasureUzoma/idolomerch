import { Search } from "lucide-react";
import React from "react";

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <div className="relative w-full max-w-sm md:max-w-3xl">
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none p-2 bg-gray-100 bg-opacity-20 rounded-md"
      >
        <Search size={21} />
      </button>
      <input
        {...props}
        className={`w-full pl-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
          props.className ?? ""
        }`}
      />
    </div>
  );
};
