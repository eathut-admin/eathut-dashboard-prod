"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { GetAllHubLinkedWithAdminDetails } from "@/actions/hub/GetAllHubLinkedWithAdminDetails.action";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { GetThreeMonthOrderChartDataByAdmin } from "@/actions/sales-page/GetThreeMonthOrderChartDataByAdmin.action";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorAnimation from "../loading-animations/Error-animation";

const hubDataSchema = z.object({
  adminId: z.string().min(1, { message: "Select a hub" }),
});

const chartConfig = {
  customer: {
    label: "Customer",
    color: "hsl(var(--chart-1))",
  },
  order: {
    label: "Order",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function HubReportLastThreeMonths() {
  const [hubData, setHubData] = React.useState<any[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof hubDataSchema>>({
    resolver: zodResolver(hubDataSchema),
  });

  async function onSubmit(values: z.infer<typeof hubDataSchema>) {
    setButtonLoading(true);

    try {
      const response = await GetThreeMonthOrderChartDataByAdmin(values.adminId);

      if (response.error || response.statusCode !== 200) {
        setError(response.error);
      } else {
        setChartData(response.data);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setButtonLoading(false);
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await GetAllHubLinkedWithAdminDetails();

        if (response && response.statusCode === 200 && response.success) {
          setHubData(response.data);
        } else {
          setError(response.error);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-10 w-[160px] xl:w-[250px]" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className="text-xl">
              Check out the last three months hub report.
            </CardTitle>
            <CardDescription>
              Showing total visitors for the last 3 months
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex h-[250px] items-center justify-center text-red-500">
            <ErrorAnimation massage={error} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-xl">
            Check out the last three months hub report.
          </CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex gap-2 items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="adminId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="w-[160px] xl:w-[250px] rounded-lg sm:ml-auto"
                          aria-label="Select a hub">
                          <SelectValue placeholder="Select a hub" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {hubData.length > 0 ? (
                          hubData.map((hub, index) => (
                            <SelectItem value={hub._id} key={index}>
                              {hub.city}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="No hub found" disabled>
                            No hub found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="sm" className="h-10">
                {buttonLoading ? (
                  <ButtonLoadingAnimation text="Getting..." />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillcustomer" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-customer)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-customer)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillorder" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-order)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-order)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="order"
              type="natural"
              fill="url(#fillorder)"
              stroke="var(--color-order)"
              stackId="a"
              role="img"
              aria-label="Order data"
            />
            <Area
              dataKey="customer"
              type="natural"
              fill="url(#fillcustomer)"
              stroke="var(--color-customer)"
              stackId="a"
              role="img"
              aria-label="Customer data"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
