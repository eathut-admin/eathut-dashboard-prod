"use client";

import { RiBubbleChartLine } from "react-icons/ri";

const DashboardCardComp = ({
  title,
  value,
  date,
  loading,
  error,
}: {
  title: string;
  value: string;
  date: string;
  loading: boolean;
  error: any;
}) => {
  return (
    <section className="h-full lg:h-56 rounded-xl bg-muted/50 border">
      <div className="w-full rounded-lg p-5 transition duration-300 h-full relative">
        {!loading ? (
          <>
            <div>
              <h3 className="md:text-lg tracking-wider font-semibold">
                {title || error.message}
              </h3>
              <div className="flex items-center mt-1">
                <p className="font-sans text-[25px] md:text-[33px] font-bold">
                  {value || "0"}
                </p>
              </div>
              <p className="text-[10.5px] md:text-xs font-semibold mt-1">
                {date || "00/00/0000"}
              </p>
            </div>
            <RiBubbleChartLine className="text-green-500 text-4xl absolute right-5 bottom-5" />
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="space-y-2 w-full">
              <div className="animate-pulse rounded-md bg-gray-300 dark:bg-gray-500 h-3 w-[35%]"></div>
              <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-500 h-6 w-[70%]"></div>
              <div className="animate-pulse rounded-md bg-gray-300 dark:bg-gray-500 h-2 w-[15%]"></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardCardComp;
