"use client";

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
import { useEffect, useState } from "react";
import { GetRestaurantSpecificSixMonthSalesChartData } from "@/actions/restaurant/GetRestaurantSpecificSixMonthSalesChartData.action";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorAnimation from "../loading-animations/Error-animation";

const chartConfig = {
  order: {
    label: "Order",
    color: "hsl(var(--chart-1))",
  },
  customer: {
    label: "Customer",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const RestaurantSalesChartComponent = ({
  restaurantId,
}: {
  restaurantId: string;
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await GetRestaurantSpecificSixMonthSalesChartData(
            restaurantId
          );
          if ("error" in response) {
            setError(response.error);
          } else {
            setData(response);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Monthly Orders & Customers</CardTitle>
          <CardDescription className="-translate-y-1">
            Error loading data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-red-500">
            <ErrorAnimation massage={error} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Monthly Orders & Customers</CardTitle>
        <CardDescription className="-translate-y-1">
          {data?.[0]?.month} - {data?.[5]?.month} {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="order" fill="var(--color-order)" radius={4} />
            <Bar dataKey="customer" fill="var(--color-customer)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RestaurantSalesChartComponent;
