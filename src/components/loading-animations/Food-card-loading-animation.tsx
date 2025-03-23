import React from "react";

const FoodCardLoadingAnimation = () => {
  return (
    <div>
      <div>
        <div className="animate-pulse rounded-md bg-gray-300 dark:bg-gray-500 h-52 w-full"></div>
      </div>
      <div className="grid gap-1.5 mt-2">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-8 w-8 rounded-full"></div>

        <p className="animate-pulse rounded-full bg-gray-300 dark:bg-gray-500 h-3 w-[30%]"></p>
        <p className="animate-pulse rounded-full bg-gray-300 dark:bg-gray-500 h-3 w-[60%]"></p>
        <p className="animate-pulse rounded-full bg-gray-300 dark:bg-gray-500 h-3 w-full"></p>
      </div>
    </div>
  );
};

export default FoodCardLoadingAnimation;
