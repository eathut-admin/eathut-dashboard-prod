"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import TrackMultipleOrderIdTable from "./track-multiple-order-table";
import { cn } from "@/lib/utils";
import { FetchOrderDataWithOrderId } from "@/actions/order-track/TrackOrderWithOrderId.action";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";

const formSchema = z.object({
  orderIds: z
    .string()
    .min(1, "Order IDs are required")
    .refine(
      (value) => {
        const ids = value.split(",").map((id) => id.trim());
        const uniqueIds = Array.from(new Set(ids));
        return ids.length === uniqueIds.length;
      },
      { message: "Order IDs must be unique" }
    ),
});

const TrackMultipleOrderPageComp: React.FC = () => {
  const [trackedOrders, setTrackedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderIds: "",
    },
  });

  const fetchOrderData = async (orderIds: string) => {
    setLoading(true);
    try {
      const uniqueIds = orderIds.split(",").map((id) => id.trim());
      const orders: any[] = [];

      for (const id of uniqueIds) {
        try {
          const response = await FetchOrderDataWithOrderId(id);
          if (!response.success) {
            toast.error(`Failed to fetch order with ID ${id}`);
            continue;
          }
          orders.push(response.data);
        } catch (error: any) {
          toast.error(`Failed!! ${id} : ${error.message}`);
        }
      }

      setTrackedOrders(orders);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const ids = values.orderIds.split(",").map((id) => id.trim());
    fetchOrderData(ids.join(","));
  };

  const handleOrderClick = (orderId: string) => {
    router.push(
      `/order-track/track-single-order/?orderId=${encodeURIComponent(orderId)}`
    );
  };

  return (
    <main className="min-h-full">
      <section className="mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col md:flex-row items-center gap-3">
            <div className="w-full">
              <FormField
                control={form.control}
                name="orderIds"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Order Ids Here (separated by comma(,))"
                        {...field}
                        autoComplete="off"
                        className={cn(
                          "border-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-12 text-[13px]",
                          { "opacity-50": loading }
                        )}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-36 md:w-44 md:h-12"
              variant="default"
              disabled={loading}>
              {loading ? <ButtonLoadingAnimation text="Tracking" /> : "Track"}
            </Button>
          </form>
        </Form>
      </section>

      <section className="mt-10">
        {loading ? (
          <TableLoadingAnimation />
        ) : (
          <TrackMultipleOrderIdTable
            data={trackedOrders}
            handleOrderClick={handleOrderClick}
          />
        )}
      </section>
      <Toaster richColors />
    </main>
  );
};

export default TrackMultipleOrderPageComp;
