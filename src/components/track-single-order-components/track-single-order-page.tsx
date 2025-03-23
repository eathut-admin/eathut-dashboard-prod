"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import ShowOrderDetails from "./show-order-details";
import { FetchOrderDataWithOrderId } from "@/actions/order-track/TrackOrderWithOrderId.action";
import { cn } from "@/lib/utils";

const trackSingleOrderSchema = z.object({
  order_id: z.string().min(1, {
    message: "Please enter a valid order id.",
  }),
});

const TrackSingleOrderPageComp = () => {
  const form = useForm<z.infer<typeof trackSingleOrderSchema>>({
    resolver: zodResolver(trackSingleOrderSchema),
    defaultValues: {
      order_id: "",
    },
  });

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId");

  const handleTrack = async (id: string) => {
    setLoading(true);
    try {
      const response = await FetchOrderDataWithOrderId(id);

      if (response.statusCode === 200 && response.success) {
        setData(response.data);
        setError(null);
      } else {
        setError(response.error);
        setData(null);
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryOrderId) {
      form.setValue("order_id", queryOrderId);
      handleTrack(queryOrderId.trim());
    }
  }, [queryOrderId, form]);

  function onSubmit(values: z.infer<typeof trackSingleOrderSchema>) {
    handleTrack(values.order_id.trim());
  }

  return (
    <main className="min-h-full">
      <div className="mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col md:flex-row items-center gap-3">
            <div className="w-full">
              <FormField
                control={form.control}
                name="order_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        autoComplete="off"
                        disabled={loading}
                        placeholder="Enter single order id to track the order details."
                        className={cn(
                          "border-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-12 text-[13px]",
                          { "opacity-50": loading }
                        )}
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
      </div>

      <div className="mt-10">
        <ShowOrderDetails
          orders={data ? data : []}
          loading={loading}
          error={error ? error : ""}
        />
      </div>
    </main>
  );
};

export default TrackSingleOrderPageComp;
