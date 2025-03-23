"use client";

import { useCallback, useEffect, useState } from "react";
import { TbTruck } from "react-icons/tb";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { Button } from "../ui/button";
import { GetAllHubLinkedWithAdminDetails } from "@/actions/hub/GetAllHubLinkedWithAdminDetails.action";
import { GetDailyOrderLiveReports } from "@/actions/dashboard/GetDailyOrderLiveReports.action";
import ShowDailyOrderLiveReportSheetComponent from "./show-daily-order-live-report-sheet-component";
import DashboardTableLoadingAnimation from "../loading-animations/Dashboard-table-loading-animation";

const trackFoodBasedOnRestaurantSchema = z.object({
  hubId: z.string().optional(),
});

const DailyOrdersLiveReportComponent = ({
  currentUserData,
}: {
  currentUserData: { role: string; adminId: string; name: string };
}) => {
  const form = useForm<z.infer<typeof trackFoodBasedOnRestaurantSchema>>({
    resolver: zodResolver(trackFoodBasedOnRestaurantSchema),
    defaultValues: {
      hubId: "",
    },
  });

  const currentDateTime = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [data, setData] = useState<any>([]);
  const [hubs, setHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [trackButtonLoading, setTrackButtonLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = useCallback(
    async (hubId?: string) => {
      setLoading(true);
      setTrackButtonLoading(true);
      try {
        const response = await GetDailyOrderLiveReports(
          hubId || currentUserData.adminId
        );

        if (response.statusCode === 200 && response.success) {
          setData(response.data);
          setError(null);
        } else {
          setError("Failed to fetch order data.");
        }
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
        setTrackButtonLoading(false);
      }
    },
    [currentUserData.adminId]
  );

  useEffect(() => {
    if (currentUserData.role === "ADMIN") {
      handleTrack(currentUserData.adminId);
    }
  }, [currentUserData, handleTrack]);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const hubResponse = await GetAllHubLinkedWithAdminDetails();

        if ("error" in hubResponse) {
          setError(hubResponse.error);
        } else {
          setHubs(hubResponse.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function onSubmit(values: z.infer<typeof trackFoodBasedOnRestaurantSchema>) {
    handleTrack(values.hubId?.trim());
  }

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

  return (
    <div>
      <div className="flex justify-center items-center gap-8">
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
        <TbTruck className="text-lg shrink-0 grow" />
        <h1 className="text-2xl font-extrabold shrink-0 grow">
          Daily Order Report
        </h1>
        <TbTruck className="text-lg shrink-0 grow" />
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
      </div>

      <div>
        <div className="mt-10">
          {currentUserData?.role === "SUPER-ADMIN" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-3">
                <div className="shrink-0 grow">
                  <FormField
                    control={form.control}
                    name="hubId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            {...field}
                            value={field.value}
                            onValueChange={field.onChange}>
                            <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-11">
                              <SelectValue placeholder="Select hub" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <ScrollArea>
                                {hubs.length > 0 ? (
                                  <>
                                    {hubs.map((hub, index) => (
                                      <SelectItem
                                        key={index}
                                        value={hub._id}
                                        className="w-full">
                                        <div className="flex justify-between gap-x-20 cursor-pointer w-full">
                                          <span>Hub Name : {hub.city}</span>
                                          <span>Admin Name : {hub.name}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </>
                                ) : (
                                  <div className="text-[10px] -translate-y-1 inline-block bg-yellow-500 text-black px-[14px] py-0.5 rounded-full">
                                    No hubs found
                                  </div>
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-36 md:w-44 md:h-11"
                  variant="default"
                  disabled={trackButtonLoading}>
                  {trackButtonLoading ? (
                    <ButtonLoadingAnimation text="Tracking" />
                  ) : (
                    "Track"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>

        <section className="mt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center border font-bold">
                  Total
                </TableHead>
                <TableHead className="text-center border font-bold">
                  Pending
                </TableHead>
                <TableHead className="text-center border font-bold">
                  Delivered
                </TableHead>
                <TableHead className="text-center border font-bold">
                  Cancelled
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
                    <ShowDailyOrderLiveReportSheetComponent
                      todayDate={currentDateTime}
                      data={[
                        ...(data?.pendingOrders || []),
                        ...(data?.deliveredOrders || []),
                        ...(data?.cancelledOrders || []),
                      ]}
                      title="">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={
                          data.pendingOrders?.length === 0 &&
                          data.deliveredOrders?.length === 0 &&
                          data.cancelledOrders?.length === 0
                        }>
                        {Number(data?.pendingOrders?.length) +
                          Number(data?.deliveredOrders?.length) +
                          Number(data?.cancelledOrders?.length) || "-"}
                      </Button>
                    </ShowDailyOrderLiveReportSheetComponent>
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <ShowDailyOrderLiveReportSheetComponent
                      todayDate={currentDateTime}
                      data={data?.pendingOrders || []}
                      title="Pending">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={data.pendingOrders?.length === 0}>
                        {data?.pendingOrders?.length || "-"}
                      </Button>
                    </ShowDailyOrderLiveReportSheetComponent>
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <ShowDailyOrderLiveReportSheetComponent
                      todayDate={currentDateTime}
                      data={data?.deliveredOrders || []}
                      title="Delivered">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={data.deliveredOrders?.length === 0}>
                        {data?.deliveredOrders?.length || "-"}
                      </Button>
                    </ShowDailyOrderLiveReportSheetComponent>
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <ShowDailyOrderLiveReportSheetComponent
                      todayDate={currentDateTime}
                      data={data?.cancelledOrders || []}
                      title="Cancelled">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={data.cancelledOrders?.length === 0}>
                        {data?.cancelledOrders?.length || "-"}
                      </Button>
                    </ShowDailyOrderLiveReportSheetComponent>
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

export default DailyOrdersLiveReportComponent;
