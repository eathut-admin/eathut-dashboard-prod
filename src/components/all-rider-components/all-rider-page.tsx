"use client";

import { GetAllRiderData } from "@/actions/all-rider/GetAllRiderData.action";
import { AllRiderPageColumns } from "@/app/data-table-components/all-rider/All-rider-page-column";
import { AllRiderPageDataTable } from "@/app/data-table-components/all-rider/All-rider-page-data-table";
import { useEffect, useState } from "react";
import ErrorAnimation from "../loading-animations/Error-animation";
import { Button } from "../ui/button";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbTruckOff } from "react-icons/tb";
import { toast } from "sonner";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { ToggleRiderStatus } from "@/actions/all-rider/ToggleRiderStatus.action";

const AllRiderPageComp = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState("Active Riders");
  const [buttonLoadingBlock, setButtonLoadingBlock] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await GetAllRiderData();

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

  const handleBlock = async (riderId: string) => {
    setButtonLoadingBlock((prev) => ({ ...prev, [riderId]: true }));
    try {
      const result = await ToggleRiderStatus(riderId);
      if (result) {
        setData((prevData) =>
          prevData.map((rider) =>
            rider._id === riderId
              ? {
                  ...rider,
                  availability:
                    rider.availability === "AVAILABLE"
                      ? "UNAVAILABLE"
                      : "AVAILABLE",
                }
              : rider
          )
        );
        toast.success(
          `Rider ${
            result.availability === "AVAILABLE" ? "unblocked" : "blocked"
          } successfully`
        );
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingBlock((prev) => ({ ...prev, [riderId]: false }));
    }
  };

  const activeRiders = data.filter(
    (rider) => rider.availability === "AVAILABLE"
  );
  const inactiveRiders = data.filter(
    (rider) => rider.availability != "AVAILABLE"
  );

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
          disabled={activeTable === "Active Riders"}
          className={`px-3 h-12 ${
            activeTable === "Active Riders" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("Active Riders")}>
          <CiDeliveryTruck />
          All Active Riders
        </Button>
        <Button
          variant="default"
          disabled={activeTable === "Inactive Riders"}
          className={`px-3 h-12 ${
            activeTable === "Inactive Riders" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("Inactive Riders")}>
          <TbTruckOff />
          All Inactive Riders
        </Button>
      </div>

      <div className="mt-20">
        {activeTable === "Active Riders" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <AllRiderPageDataTable
                data={activeRiders ? activeRiders : []}
                columns={AllRiderPageColumns({
                  handleBlock,
                  buttonLoadingBlock,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "Inactive Riders" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <AllRiderPageDataTable
                data={inactiveRiders ? inactiveRiders : []}
                columns={AllRiderPageColumns({
                  handleBlock,
                  buttonLoadingBlock,
                })}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default AllRiderPageComp;
