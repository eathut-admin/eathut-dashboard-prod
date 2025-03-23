"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RestaurantPanelDataTable } from "@/app/data-table-components/restaurant-panel/Restaurant-panel-data-table";
import { RestaurantPanelColumns } from "@/app/data-table-components/restaurant-panel/Restaurant-panel-column";
import ErrorAnimation from "../loading-animations/Error-animation";
import { GetAllRestaurantDetails } from "@/actions/restaurant/RestaurantDetails.action";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { ToggleRestaurantStatus } from "@/actions/restaurant/ToggleRestaurantStatus.action";

const RestaurantPanelPageComp = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [buttonLoadingDelete, setButtonLoadingDelete] = useState<
  //   Record<string, boolean>
  // >({});
  const [buttonLoadingBlock, setButtonLoadingBlock] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response = await GetAllRestaurantDetails();

        if ("error" in response) {
          setError(response.error);
        } else {
          setData(response.data);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // const handleDelete = async (restaurantId: string) => {
  //   setButtonLoadingDelete((prev) => ({ ...prev, [restaurantId]: true }));
  //   try {
  //     const result = await deleteUser(restaurantId);
  //     if (result) {
  //       setData((prevData: any) =>
  //         prevData.filter(
  //           (restaurant: any) => restaurant.restaurantId !== restaurantId
  //         )
  //       );
  //       toast.success(result.message);
  //     } else {
  //       throw new Error(result.error);
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setButtonLoadingDelete((prev) => ({ ...prev, [restaurantId]: false }));
  //   }
  //   console.log("Admin Id : ", restaurantId);
  // };

  const handleBlock = async (restaurantId: string) => {
    setButtonLoadingBlock((prev) => ({ ...prev, [restaurantId]: true }));
    try {
      const result = await ToggleRestaurantStatus(restaurantId);
      if (result) {
        setData((prevData: any) =>
          prevData.filter(
            (restaurant: any) => restaurant.restaurantId !== restaurantId
          )
        );
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingBlock((prev) => ({ ...prev, [restaurantId]: false }));
    }
  };

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full text-white">
      <div className="mt-12">
        {loading ? (
          <TableLoadingAnimation />
        ) : (
          <>
            <RestaurantPanelDataTable
              data={data ? data : []}
              columns={RestaurantPanelColumns({
                // handleDelete,
                handleBlock,
                // buttonLoadingDelete,
                buttonLoadingBlock,
              })}
            />
          </>
        )}
      </div>
    </main>
  );
};

export default RestaurantPanelPageComp;
