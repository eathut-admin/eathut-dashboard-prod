import React from "react";

const CardLoadingAnimation = () => {
  return (
    <div className="h-full border-2 rounded-md p-10 text-[16px] relative flex flex-col justify-center gap-3">
      <div className="absolute top-2 right-4">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-6 w-28 rounded-full"></div>
      </div>

      <span className="flex items-center gap-4">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-6 w-6 rounded-full"></div>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-4 w-28 rounded-full"></div>
      </span>

      <span className="flex items-center gap-4">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-6 w-6 rounded-full"></div>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-4 w-36 rounded-full"></div>
      </span>

      <span className="flex items-start gap-4">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-6 w-6 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-3 w-full rounded-full"></div>
          <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-3 w-full rounded-full"></div>
        </div>
      </span>
    </div>
  );
};

export default CardLoadingAnimation;
