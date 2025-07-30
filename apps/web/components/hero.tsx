"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchInput } from "./search-input";

export const Hero = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("called")
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-primary h-[19rem] md:h-[25rem] flex flex-col text-center items-center justify-center space-y-6 md:space-y-[5rem] px-6 md:px-0">
      <h1 className="font-bold text-3xl md:text-4xl text-white md:w-[42%]">
        Hey Techie! 👋 What are you shopping for today?
      </h1>
      <SearchInput
        placeholder="Find Products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch} 
      />
    </div>
  );
};
