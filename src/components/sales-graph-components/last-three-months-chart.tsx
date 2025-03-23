"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GetLastThreeMonthsChartDataEveryDay } from "@/actions/sales-page/GetLastThreeMonthsChartDataEveryDay.action";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorAnimation from "../loading-animations/Error-animation";

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

export function LastThreeMonthsChartEveryDay() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("customer");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetLastThreeMonthsChartDataEveryDay();

        if (response.error || response.statusCode !== 200) {
          setError(response.error);
        } else {
          setData(response.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = React.useMemo(
    () => ({
      customer: data.reduce((acc, curr) => acc + curr.customer, 0),
      order: data.reduce((acc, curr) => acc + curr.order, 0),
    }),
    [data]
  );

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex">
            {["customer", "order"].map((key) => (
              <div
                key={key}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-3/4 sm:h-8" />
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle className="text-xl">
              Last 3 Months Report Chart
            </CardTitle>
            <CardDescription className="-translate-y-1">
              Orders and Customers
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="flex h-[250px] items-center justify-center text-red-500">
            <ErrorAnimation massage={error} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-xl">Last 3 Months Report Chart</CardTitle>
          <CardDescription className="-translate-y-1">
            Orders and Customers
          </CardDescription>
        </div>
        <div className="flex">
          {["customer", "order"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
                aria-label={`Show ${chartConfig[chart].label} data`}>
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              role="img"
              aria-label={`${chartConfig[activeChart].label} data`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
