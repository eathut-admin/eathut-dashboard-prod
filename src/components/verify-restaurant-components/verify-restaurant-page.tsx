"use client";

import { useEffect, useState } from "react";
import { GrRestaurant } from "react-icons/gr";
import { toast } from "sonner";
import ErrorAnimation from "../loading-animations/Error-animation";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { VerifyRestaurantDataTable } from "@/app/data-table-components/restaurant-verification/Verify-restaurant-data-table";
import { VerifyRestaurantPageColumns } from "@/app/data-table-components/restaurant-verification/Verify-restaurant-column";
import { GetAllUnverifiedRestaurantDetails } from "@/actions/verify-rider-restaurant/GetAllUnverifiedRestaurantDetails";
import { verifyOrRejectRestaurant } from "@/actions/verify-rider-restaurant/verifyOrRejectRestaurant";
import { useUserRole } from "@/context/user-role-context";

const VerifyRestaurantPageComp = () => {
  const [restaurantData, setRestaurantData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLoadingAccept, setButtonLoadingAccept] = useState<
    Record<string, boolean>
  >({});
  const [buttonLoadingReject, setButtonLoadingReject] = useState<
    Record<string, boolean>
  >({});

  const { userRole } = useUserRole();

  const handleAccept = async (_id: string) => {
    setButtonLoadingAccept((prev) => ({ ...prev, [_id]: true }));
    try {
      const result = await verifyOrRejectRestaurant(_id, "VERIFIED");
      if (result.error) {
        toast.error(result.error);
      }
      setRestaurantData((prevData: any) =>
        prevData.filter((restaurant: any) => restaurant._id !== _id)
      );
      toast.success("Restaurant verified successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingAccept((prev) => ({ ...prev, [_id]: false }));
    }
  };

  const handleReject = async (_id: string) => {
    setButtonLoadingReject((prev) => ({ ...prev, [_id]: true }));
    try {
      const result = await verifyOrRejectRestaurant(_id, "REJECTED");
      if (result.error) {
        toast.error(result.error);
      }
      setRestaurantData((prevData: any) =>
        prevData.filter((restaurant: any) => restaurant._id !== _id)
      );
      toast.success("Restaurant rejected successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingReject((prev) => ({ ...prev, [_id]: false }));
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await GetAllUnverifiedRestaurantDetails();
        if ("error" in response) {
          setError(response.error);
        } else {
          setRestaurantData(response.data);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      <div className="flex justify-center items-center gap-8 mt-10">
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
        <GrRestaurant className="text-lg shrink-0 grow" />
        <h1 className="text-2xl font-extrabold shrink-0 grow">
          Verify Restaurant
        </h1>
        <GrRestaurant className="text-lg shrink-0 grow" />
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
      </div>
      <div className="mt-14">
        {loading ? (
          <TableLoadingAnimation />
        ) : (
          <VerifyRestaurantDataTable
            data={restaurantData ? restaurantData : []}
            columns={VerifyRestaurantPageColumns({
              handleAccept,
              handleReject,
              buttonLoadingAccept,
              buttonLoadingReject,
              userRole,
            })}
          />
        )}
      </div>
    </main>
  );
};

export default VerifyRestaurantPageComp;
