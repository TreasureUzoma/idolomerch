import React from "react";

export const ErrorPage = ({ error }: { error?: Error }) => {
  return (
    <div className="h-full flex items-center justify-center text-red-500 flex-col">
      <h1 className="text-4xl text-white">Oh (:</h1>
      {error?.message ?? "An error occurred"}
    </div>
  );
};
