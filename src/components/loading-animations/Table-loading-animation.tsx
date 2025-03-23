const TableLoadingAnimation = () => {
  return (
    <section className="h-44">
      <div className="grid grid-cols-3 md:grid-cols-5">
        <div className="flex gap-8 w-full col-span-2 md:col-span-4">
          <div className="animate-pulse rounded-full bg-gray-300 dark:bg-gray-500 h-12 w-[25%]"></div>
          <div className="animate-pulse rounded-full bg-gray-300 dark:bg-gray-500 h-12 w-[17%]"></div>
        </div>
        <div className="flex justify-end gap-3 w-full">
          <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-500 h-12 w-[14%]"></div>
          <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-500 h-12 w-[14%]"></div>
        </div>
      </div>
      <div className="animate-pulse rounded-md bg-gray-300 dark:bg-gray-500 h-44 w-[100%] my-4"></div>
      <div className="flex justify-between">
        <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-500 h-4 w-[10%]"></div>
        <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-500 h-4 w-[20%]"></div>
      </div>
    </section>
  );
};

export default TableLoadingAnimation;
