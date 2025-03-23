"use client";

import { HubReportLastThreeMonths } from "./hub-report-last-three-months";
import { LastThreeMonthsChartEveryDay } from "./last-three-months-chart";
// import { LineChartMultipleCustomerAndOrder } from "./line-chart-multiple";
import { TotalActiveRiderTodayRadialChart } from "./total-active-rider-today-radial-chart";

const SalesGraphPageComp = () => {
  return (
    <main className="min-h-full">
      {/* <div className="mt-11 flex items-center gap-5">
        <h1 className="text-lg lobster-font shrink-0">
          Eathut Orders & Customers Report Graph
        </h1>
        <hr className="h-0.5 outline-none w-full bg-black dark:bg-white" />
      </div> */}

      <div className="mt-5 items-center h-full">
        {/* <div className="h-full xl:col-span-2 2xl:col-span-1">
          <LineChartMultipleCustomerAndOrder />
        </div> */}
        <LastThreeMonthsChartEveryDay />
      </div>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 items-center gap-8 h-full">
        <div className="h-full lg:col-span-2 xl:col-span-3">
          <HubReportLastThreeMonths />
        </div>
        <div className="h-full">
          <TotalActiveRiderTodayRadialChart />
        </div>
      </div>
    </main>
  );
};

export default SalesGraphPageComp;
