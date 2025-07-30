"use client";
import { baseUrl } from "@/constants";
import { useEffect } from "react";

export const ServerWaker = () => {
  useEffect(() => {
    fetch(`${baseUrl}/health`).catch(() => {});
  }, []);

  return null;
};
