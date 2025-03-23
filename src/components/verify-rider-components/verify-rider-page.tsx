"use client";

import { useEffect, useState } from "react";
import { TbTruck } from "react-icons/tb";
import { toast } from "sonner";
import ErrorAnimation from "../loading-animations/Error-animation";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { VerifyRiderDataTable } from "@/app/data-table-components/rider-verification/Verify-rider-data-table";
import { VerifyRiderPageColumns } from "@/app/data-table-components/rider-verification/Verify-rider-column";
import { GetAllUnverifiedRiderDetails } from "@/actions/verify-rider-restaurant/GetAllUnverifiedRiderDetails";
import { verifyOrRejectDeliveryPartner } from "@/actions/verify-rider-restaurant/VerifyOrRejectDeliveryPartner";
import { useUserRole } from "@/context/user-role-context";

const VerifyRiderPageComp = () => {
  const [riderData, setRiderData] = useState<any[]>([]);
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
      const result = await verifyOrRejectDeliveryPartner(_id, "VERIFIED");
      if (result.error) {
        throw new Error(result.error);
      }
      setRiderData((prevData: any) =>
        prevData.filter((restaurant: any) => restaurant._id !== _id)
      );
      toast.success("Rider verified successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingAccept((prev) => ({ ...prev, [_id]: false }));
    }
  };

  const handleReject = async (_id: string) => {
    setButtonLoadingReject((prev) => ({ ...prev, [_id]: true }));
    try {
      const result = await verifyOrRejectDeliveryPartner(_id, "REJECTED");
      if (result.error) {
        throw new Error(result.error);
      }
      setRiderData((prevData: any) =>
        prevData.filter((restaurant: any) => restaurant._id !== _id)
      );
      toast.success("Rider rejected successfully!");
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
        const response = await GetAllUnverifiedRiderDetails();
        if ("error" in response) {
          setError(response.error);
        } else {
          setRiderData(response.data);
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
        <TbTruck className="text-lg shrink-0 grow" />
        <h1 className="text-2xl font-extrabold shrink-0 grow">Verify Rider</h1>
        <TbTruck className="text-lg shrink-0 grow" />
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
      </div>
      <div className="mt-14">
        {loading ? (
          <TableLoadingAnimation />
        ) : (
          <VerifyRiderDataTable
            data={riderData ? riderData : []}
            columns={VerifyRiderPageColumns({
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

export default VerifyRiderPageComp;
