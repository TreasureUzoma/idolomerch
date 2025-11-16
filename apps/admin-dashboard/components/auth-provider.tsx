"use client";
// tbh this isnt really neccessary
import { useSession } from "@/hooks/session";

export const WithAuth = () => {
  const { data } = useSession();
  if (!data) return null;
  return <></>;
};
