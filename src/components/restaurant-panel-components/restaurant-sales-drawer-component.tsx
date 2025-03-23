"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import RestaurantSalesChartComponent from "./restaurant-sales-chart-component";
import RestaurantCashWithdrawalSheetComponent from "./restaurant-cash-withdrawal-sheet-component";
import { GetRestaurantSpecificSalesData } from "@/actions/restaurant/RestaurantSpecificChartData.action";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const RestaurantSalesDrawerComponentSkeleton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-5xl min-h-[550px]">
          <DrawerHeader className="justify-center mt-4">
            <DrawerTitle className="text-center">
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </DrawerTitle>
            <DrawerDescription className="text-center">
              <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mt-2"></div>
            </DrawerDescription>
          </DrawerHeader>
          <hr className="mb-5 w-full m-auto bg-black dark:bg-white outline-none h-0.5" />

          <div className="h-full grid grid-cols-2 gap-5">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full overflow-hidden grid items-center">
              <div className="self-start">
                <table className="table-auto w-full mb-10 text-sm">
                  <thead className="text-center">
                    <tr className="border">
                      <th className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </th>
                      <th className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </th>
                      <th className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="border px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="border px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="border px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="table-auto w-full text-sm">
                  <tbody>
                    {[...Array(4)].map((_, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          <div className="h-4 bg-gray-300 rounded"></div>
                        </td>
                        <td className="border px-4 py-2">
                          <div className="h-4 bg-gray-300 rounded"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between self-end text-sm">
                <span className="flex items-center gap-2 border px-3 py-1">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </span>
                <span className="inline-block border px-3 py-1">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </span>
                <span className="inline-block border px-3 py-1">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const RestaurantSalesDrawerComponent = ({
  children,
  ownerName,
  ownerEmail,
  restaurantId,
  restaurantName,
  totalOrders,
  cancelledOrders,
}: {
  children: React.ReactNode;
  ownerName: string;
  ownerEmail: string;
  restaurantId: string;
  restaurantName: string;
  totalOrders: any;
  cancelledOrders: any;
}) => {
  const [sales, setSales] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (restaurantId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await GetRestaurantSpecificSalesData(restaurantId);
          if ("error" in response) {
            setError(response.error);
          } else {
            setSales(response);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [restaurantId]);

  const percentageChange = sales?.yesterdayIncome
    ? ((sales?.todayIncome - sales?.yesterdayIncome) / sales?.yesterdayIncome) *
      100
    : 0;

  const displayChange = percentageChange.toFixed(2);

  const orderIndicator =
    sales?.yesterdayIncome < sales?.todayIncome ? (
      <FaArrowTrendUp className="text-green-500" />
    ) : sales?.yesterdayIncome > sales?.todayIncome ? (
      <FaArrowTrendDown className="text-red-500" />
    ) : null;

  if (loading) {
    return (
      <RestaurantSalesDrawerComponentSkeleton>
        {children}
      </RestaurantSalesDrawerComponentSkeleton>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-5xl min-h-[550px]">
          <DrawerHeader className="justify-center mt-4">
            <DrawerTitle className="text-center">Move Goal</DrawerTitle>
            <DrawerDescription className="text-center">
              Set your daily activity goal.
            </DrawerDescription>
          </DrawerHeader>
          <hr className="mb-5 w-full m-auto bg-black dark:bg-white outline-none h-0.5" />

          <div className="h-full grid grid-cols-2 gap-5">
            <RestaurantSalesChartComponent
              restaurantId={restaurantId ? restaurantId : ""}
            />
            <div className="w-full overflow-hidden grid items-center">
              <div className="self-start">
                <table className="table-auto w-full mb-10 text-sm">
                  <thead className="text-center">
                    <tr className="border">
                      <th className="px-4 py-2">Total Orders</th>
                      <th className="px-4 py-2">Cancelled</th>
                      <th className="px-4 py-2">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="border px-4 py-2">{totalOrders}</td>
                      <td className="border px-4 py-2">
                        {sales?.totalCancelledOrders || cancelledOrders}
                      </td>
                      <td className="border px-4 py-2">
                        {sales?.overallRating} ⭐
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="table-auto w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Total Income (All Time)
                      </td>
                      <td className="border px-4 py-2 flex justify-center">
                        ₹ {sales?.totalIncome}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Total Withdrawal (All Time)
                      </td>
                      <td className="border px-4 py-2 flex justify-center">
                        ₹{" "}
                        {sales?.withdrawalHistory
                          ? sales.withdrawalHistory
                              .reduce(
                                (total: number, item: any) =>
                                  total + item.amount,
                                0
                              )
                              .toFixed(2)
                          : "00.00"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Remaining Wallet Balance
                      </td>
                      <td className="border px-4 py-2 flex justify-center">
                        ₹ {sales?.walletBalance}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        History
                      </td>
                      <td className="border px-4 py-2 flex justify-center">
                        <RestaurantCashWithdrawalSheetComponent
                          restaurantName={restaurantName || ""}
                          ownerName={ownerName || ""}
                          ownerEmail={ownerEmail || ""}
                          loading={loading}
                          error={error}
                          withdrawalHistory={sales?.withdrawalHistory || []}>
                          <Button variant="secondary" className="h-8">
                            Withdrawal History
                          </Button>
                        </RestaurantCashWithdrawalSheetComponent>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between self-end text-sm">
                <span className="flex items-center gap-2 border px-3 py-1">
                  {displayChange}% {orderIndicator || "--"}
                </span>
                <span className="inline-block border px-3 py-1">
                  Today&apos;s Income: <span>{sales?.todayIncome}</span>
                </span>
                <span className="inline-block border px-3 py-1">
                  Yesterday&apos;s Income: <span>{sales?.yesterdayIncome}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RestaurantSalesDrawerComponent;
