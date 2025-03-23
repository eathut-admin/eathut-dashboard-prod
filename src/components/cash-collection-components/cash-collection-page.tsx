"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// import { z } from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "../ui/button";
// import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { CashCollectionDataTable } from "@/app/data-table-components/cash-collection/Cash-collection-page-data-table";
import { GetRiderOrderWalletRemainingCash } from "@/actions/collect-payment/GetRiderOrderWalletRemainingCash.action";
import ErrorAnimation from "../loading-animations/Error-animation";
import { CollectRiderOrderWalletBalance } from "@/actions/collect-payment/CollectRiderOrderWalletBalance.action";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { CashCollectionPageColumns } from "@/app/data-table-components/cash-collection/Cash-collection-page-column";
import { toast } from "sonner";
import { useUserRole } from "@/context/user-role-context";

// const trackSingleOrderSchema = z.object({
//   rider_id: z.string().min(1, {
//     message: "Please enter a valid order id.",
//   }),
// });

const CashCollectionPageComp = () => {
  // const form = useForm<z.infer<typeof trackSingleOrderSchema>>({
  //   resolver: zodResolver(trackSingleOrderSchema),
  //   defaultValues: {
  //     rider_id: "",
  //   },
  // });

  const { userRole } = useUserRole();

  const [data, setData] = useState<any>(null);
  const [collectedCash, setCollectedCash] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoadingCollect, setButtonLoadingCollect] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await GetRiderOrderWalletRemainingCash();

        if (response.statusCode === 200 && response.success) {
          setData(response.data.deliveryPartnerData);
          setCollectedCash(response.data.collectedAmount);
        } else {
          setError("Failed to fetch order data.");
          setData(null);
        }
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setError(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCollect = async (deliveryPartnerId: string) => {
    setButtonLoadingCollect((prev) => ({ ...prev, [deliveryPartnerId]: true }));
    try {
      const result = await CollectRiderOrderWalletBalance(deliveryPartnerId);
      if (result) {
        setData((prevData: any) =>
          prevData.filter(
            (rider: any) => rider.deliveryPartnerId !== deliveryPartnerId
          )
        );
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingCollect((prev) => ({
        ...prev,
        [deliveryPartnerId]: false,
      }));
    }
  };

  // const handleTrack = async (id: string) => {
  //   setButtonLoading(true);
  //   try {
  //     const response = await CollectRiderOrderWalletBalance(id);
  //     console.log("Response : ", response);

  //     if (response) {
  //       setData(response.data);
  //       setError(null);
  //     } else {
  //       setError("Failed to collect cash.");
  //       setData(null);
  //     }
  //   } catch (error: unknown) {
  //     setError(
  //       error instanceof Error ? error.message : "An unknown error occurred."
  //     );
  //     setData(null);
  //   } finally {
  //     setButtonLoading(false);
  //   }
  // };

  // function onSubmit(values: z.infer<typeof trackSingleOrderSchema>) {
  //   handleTrack(values.rider_id.trim());
  // }

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      {/* <div className="mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col md:flex-row items-center gap-3">
            <div className="w-full">
              <FormField
                control={form.control}
                name="rider_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={buttonLoading}
                        placeholder="Enter rider id here to collect cash"
                        className="border-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-12 text-[13px]"
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
              disabled={buttonLoading}>
              {buttonLoading ? (
                <ButtonLoadingAnimation text="Collecting..." />
              ) : (
                "Collect Cash"
              )}
            </Button>
          </form>
        </Form>
      </div> */}

      <div className="mt-12 h-12 flex items-center">
        <span className="font-semibold inline-flex px-10 bg-[#0A0A0A] dark:bg-[#fff] h-full items-center text-white dark:text-black rounded-l-md">
          Total Collected Amount :
        </span>
        <span className="font-semibold inline-flex px-5 border-2 dark:border-none dark:bg-[#4eff7a] h-full items-center text-black rounded-r-md">
          ₹ {collectedCash || "00.00"}
        </span>
      </div>

      <div className="mt-16 pb-10">
        {loading ? (
          <TableLoadingAnimation />
        ) : (
          <CashCollectionDataTable
            data={data ? data : []}
            columns={CashCollectionPageColumns({
              handleCollect,
              buttonLoadingCollect,
              userRole,
            })}
          />
        )}
      </div>
    </main>
  );
};

export default CashCollectionPageComp;
