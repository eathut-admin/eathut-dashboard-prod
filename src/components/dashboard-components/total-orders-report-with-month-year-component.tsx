"use client";

import { useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { Button } from "../ui/button";
import { GetTotalOrderReports } from "@/actions/dashboard/GetTotalOrderReports.action";
import DashboardTableLoadingAnimation from "../loading-animations/Dashboard-table-loading-animation";
import ShowTotalOrderReportSheetComponent from "./show-total-order-report-sheet-component";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

const trackFoodBasedOnRestaurantSchema = z
  .object({
    month: z.string().refine((val) => months.includes(val), {
      message: "Invalid month selected.",
    }),
    year: z.string().refine((val) => years.includes(parseInt(val)), {
      message: "Invalid year selected.",
    }),
  })
  .superRefine((data, ctx) => {
    const currentDate = new Date();
    const currentYear = currentDate?.getFullYear();
    const currentMonthIndex = currentDate?.getMonth();

    const selectedYear = parseInt(data?.year);
    const selectedMonthIndex = months?.indexOf(data?.month);

    if (
      selectedYear > currentYear ||
      (selectedYear === currentYear && selectedMonthIndex > currentMonthIndex)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selected month and year cannot be in the future.",
        path: ["month"],
      });
    }
  });

const TotalOrdersReportWithMonthYearComponent = ({
  currentUserData,
}: {
  currentUserData: { role: string; adminId: string; name: string };
}) => {
  const form = useForm<z.infer<typeof trackFoodBasedOnRestaurantSchema>>({
    resolver: zodResolver(trackFoodBasedOnRestaurantSchema),
    defaultValues: {
      month: "",
      year: "",
    },
  });

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [trackButtonLoading, setTrackButtonLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (month: string, year: string) => {
    setLoading(true);
    setTrackButtonLoading(true);
    try {
      const monthNumber = months.indexOf(month) + 1;
      const response = await GetTotalOrderReports(monthNumber.toString(), year);

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
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear().toString();
    handleTrack(currentMonth, currentYear);
  }, []);

  function onSubmit(values: z.infer<typeof trackFoodBasedOnRestaurantSchema>) {
    handleTrack(values.month, values.year);
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
          Total Orders Report
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
                <div className="shrink-0 grow grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            {...field}
                            value={field.value}
                            onValueChange={field.onChange}>
                            <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-11">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            {...field}
                            value={field.value}
                            onValueChange={field.onChange}>
                            <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-11">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
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
                  Delivered
                </TableHead>
                <TableHead className="text-center border font-bold">
                  Cancelled
                </TableHead>
                <TableHead className="text-center border font-bold">
                  Delivered Order Amount
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
                    <ShowTotalOrderReportSheetComponent
                      data={data?.totalOrders}
                      title="">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={data.totalOrders?.length === 0}>
                        {data?.totalOrders?.length || "-"}
                      </Button>
                    </ShowTotalOrderReportSheetComponent>
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <ShowTotalOrderReportSheetComponent
                      data={data?.deliveredOrders}
                      title="Delivered">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={data.deliveredOrders?.length === 0}>
                        {data?.deliveredOrders?.length || "-"}
                      </Button>
                    </ShowTotalOrderReportSheetComponent>
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <ShowTotalOrderReportSheetComponent
                      data={data?.cancelledOrders}
                      title="Cancelled">
                      <Button
                        variant="default"
                        className="min-w-[10rem]"
                        disabled={data?.cancelledOrders?.length === 0}>
                        {data?.cancelledOrders?.length || "-"}
                      </Button>
                    </ShowTotalOrderReportSheetComponent>
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {loading ? (
                    <div className="min-w-[10rem]">
                      <ButtonLoadingAnimation text="" />
                    </div>
                  ) : (
                    <>{data?.totalDeliveredOrderAmount || "00.00"}</>
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

export default TotalOrdersReportWithMonthYearComponent;
