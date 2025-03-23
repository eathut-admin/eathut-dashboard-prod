"use client";

import { useEffect, useState } from "react";
import {
  MoneyWithdrawalPageColumnsRestaurant,
  MoneyWithdrawalPageColumnsRider,
} from "@/app/data-table-components/money-withdrawal-request/Money-withdrawal-column";
import { MoneyWithdrawalDataTable } from "@/app/data-table-components/money-withdrawal-request/Money-withdrawal-data-table";
import { Button } from "../ui/button";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import ErrorAnimation from "../loading-animations/Error-animation";
import { GetPendingWithdrawRequestsOfDeliveryPartners } from "@/actions/all-rider/GetPendingWithdrawRequestsOfDeliveryPartners.action";
import { GetPendingWithdrawRequestsOfRestaurantOwners } from "@/actions/restaurant/GetPendingWithdrawRequestsOfRestaurantOwners.action";
import { approveOrRejectWithdrawRequest } from "@/actions/withdraw-requests/ApproveOrRejectWithdrawRequest.action";
import { useUserRole } from "@/context/user-role-context";
import { toast } from "sonner";

const MoneyWithdrawalPageComp = () => {
  const [restaurantData, setRestaurantData] = useState<any[]>([]);
  const [riderData, setRiderData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState("Restaurant Requests");
  const [buttonLoadingAccept, setButtonLoadingAccept] = useState<
    Record<string, boolean>
  >({});
  const [buttonLoadingReject, setButtonLoadingReject] = useState<
    Record<string, boolean>
  >({});

  const { userRole } = useUserRole();

  const handleAccept = async (withdrawId: string) => {
    setButtonLoadingAccept((prev) => ({ ...prev, [withdrawId]: true }));
    try {
      const result = await approveOrRejectWithdrawRequest(withdrawId, {
        status: "COMPLETED",
        rejectionReason: "",
      });

      if (result) {
        setRestaurantData((prevData: any) =>
          prevData.filter((data: any) => data.withdrawId !== withdrawId)
        );
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingAccept((prev) => ({ ...prev, [withdrawId]: false }));
    }
  };

  const handleReject = async ({
    withdrawId,
    rejectionReason,
  }: {
    withdrawId: string;
    rejectionReason: string;
  }) => {
    setButtonLoadingReject((prev) => ({ ...prev, [withdrawId]: true }));
    try {
      const result = await approveOrRejectWithdrawRequest(withdrawId, {
        status: "REJECTED",
        rejectionReason,
      });

      if (result) {
        setRiderData((prevData: any) =>
          prevData.filter((data: any) => data.withdrawId !== withdrawId)
        );
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingReject((prev) => ({ ...prev, [withdrawId]: false }));
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (activeTable === "Restaurant Requests") {
          const restaurantResponse =
            await GetPendingWithdrawRequestsOfRestaurantOwners();
          if ("error" in restaurantResponse) {
            setError(restaurantResponse.error);
          } else {
            setRestaurantData(restaurantResponse.data);
          }
        } else if (activeTable === "Rider Requests") {
          const riderResponse =
            await GetPendingWithdrawRequestsOfDeliveryPartners();
          if ("error" in riderResponse) {
            setError(riderResponse.error);
          } else {
            setRiderData(riderResponse.data);
          }
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeTable]);

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      <div className="grid grid-cols-2 mt-10 gap-5">
        <Button
          variant="default"
          disabled={activeTable === "Restaurant Requests"}
          className={`px-3 h-12 ${
            activeTable === "Restaurant Requests" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("Restaurant Requests")}>
          Restaurant Withdrawal Requests
        </Button>
        <Button
          variant="default"
          disabled={activeTable === "Rider Requests"}
          className={`px-3 h-12 ${
            activeTable === "Rider Requests" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("Rider Requests")}>
          Rider Withdrawal Requests
        </Button>
      </div>

      <div className="mt-10">
        {activeTable === "Restaurant Requests" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <MoneyWithdrawalDataTable
                data={restaurantData ? restaurantData : []}
                columns={MoneyWithdrawalPageColumnsRestaurant({
                  handleAccept,
                  handleReject,
                  buttonLoadingAccept,
                  buttonLoadingReject,
                  userRole,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "Rider Requests" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <MoneyWithdrawalDataTable
                data={riderData ? riderData : []}
                columns={MoneyWithdrawalPageColumnsRider({
                  handleAccept,
                  handleReject,
                  buttonLoadingAccept,
                  buttonLoadingReject,
                  userRole,
                })}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default MoneyWithdrawalPageComp;
