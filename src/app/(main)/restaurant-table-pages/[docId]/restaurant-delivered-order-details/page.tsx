"use client";

import { useEffect, useState } from "react";
import ErrorAnimation from "@/components/loading-animations/Error-animation";
import { GetAllDeliveredOrderDetailsOfParticularRestaurant } from "@/actions/orders/GetAllDeliveredOrderDetailsOfParticularRestaurant.action";
import TableLoadingAnimation from "@/components/loading-animations/Table-loading-animation";
import { RestaurantTablePagesDataTable } from "@/app/data-table-components/restaurant-table-pages/Restaurant-table-pages-data-table";
import { RestaurantTablePagesColumns } from "@/app/data-table-components/restaurant-table-pages/Restaurant-table-pages-column";

const RestaurantDeliveredOrderDetails = ({
  params,
}: {
  params: { docId: string };
}) => {
  const { docId } = params;
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response =
          await GetAllDeliveredOrderDetailsOfParticularRestaurant(
            docId,
            "DELIVERED"
          );

        if ("error" in response) {
          setError(response.error);
        } else {
          setData(response.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [docId]);

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error || "No cancelled order found"} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      <div className="mt-12">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-10 text-center uppercase border-2 py-1.5 rounded-full">
          Delivered Order Details of restaurant{" "}
          {data?.[0]?.restaurant?.restaurantName || "Restaurant"}
        </h1>

        <div>
          {loading ? (
            <TableLoadingAnimation />
          ) : (
            <RestaurantTablePagesDataTable
              data={data ? data : []}
              columns={RestaurantTablePagesColumns()}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default RestaurantDeliveredOrderDetails;
