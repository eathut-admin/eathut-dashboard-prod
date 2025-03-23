"use client";

import { TbTruck } from "react-icons/tb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { GetDailyDeliveryPartnerLiveReports } from "@/actions/dashboard/GetDailyDeliveryPartnerLiveReports.action";
import DashboardTableLoadingAnimation from "../loading-animations/Dashboard-table-loading-animation";
import ShowRiderReportSheetComponent from "./show-rider-report-sheet-component";

const DailyRiderLiveReportComponent = () => {
  const currentDateTime = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await GetDailyDeliveryPartnerLiveReports();
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

  if (error) {
    return (
      <div>
        <div className="flex justify-center items-center gap-8">
          <div className="w-full space-y-1">
            <hr className="bg-black dark:bg-white outline-none h-0.5" />
            <hr className="bg-black dark:bg-white outline-none h-0.5" />
          </div>
          <TbTruck className="text-lg shrink-0 grow" />
          <h1 className="text-2xl font-extrabold shrink-0 grow">
            Total Orders Report
          </h1>
          <TbTruck className="text-lg shrink-0 grow" />
          <div className="w-full space-y-1">
            <hr className="bg-black dark:bg-white outline-none h-0.5" />
            <hr className="bg-black dark:bg-white outline-none h-0.5" />
          </div>
        </div>

        <div className="mt-10">
          <DashboardTableLoadingAnimation />
        </div>
      </div>
    );
  }

  const activeRiders = data.filter(
    (rider: any) => rider.availability === "AVAILABLE"
  );

  const inactiveRiders = data.filter(
    (rider: any) => rider.availability === "UNAVAILABLE"
  );

  return (
    <div>
      <div className="flex justify-center items-center gap-8">
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
        <TbTruck className="text-lg shrink-0 grow" />
        <h1 className="text-2xl font-extrabold shrink-0 grow">
          Daily Rider Report
        </h1>
        <TbTruck className="text-lg shrink-0 grow" />
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
      </div>

      <div>
        <section className="mt-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center border font-bold">
                  Total Rider
                </TableHead>
                <TableHead className="text-center border font-bold">
                  Active Rider
                </TableHead>
                <TableHead className="text-center border font-bold">
                  Inactive Rider
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <ShowRiderReportSheetComponent
                      todayDate={currentDateTime}
                      data={data}
                      title="">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={data?.length === 0}>
                        {data?.length || "-"}
                      </Button>
                    </ShowRiderReportSheetComponent>
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <ShowRiderReportSheetComponent
                      todayDate={currentDateTime}
                      data={activeRiders}
                      title="Active">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={activeRiders?.length === 0}>
                        {activeRiders?.length || "-"}
                      </Button>
                    </ShowRiderReportSheetComponent>
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <ShowRiderReportSheetComponent
                      todayDate={currentDateTime}
                      data={inactiveRiders}
                      title="Inactive">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={inactiveRiders?.length === 0}>
                        {inactiveRiders?.length || "-"}
                      </Button>
                    </ShowRiderReportSheetComponent>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
};

export default DailyRiderLiveReportComponent;
