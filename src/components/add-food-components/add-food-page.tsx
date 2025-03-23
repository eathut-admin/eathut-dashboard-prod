"use client";

import AddNewFoodFormSheetComponent from "./add-new-food-from-sheet-component";
import { EditAndRemoveFoodPageColumns } from "@/app/data-table-components/edit-and-remove-food/Edit-and-remove-food-column";
import { EditAndRemoveFoodDataTable } from "@/app/data-table-components/edit-and-remove-food/Edit-and-remove-food-data-table";
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
import { ScrollArea } from "../ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { Button } from "../ui/button";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import ErrorAnimation from "../loading-animations/Error-animation";
import { GetAllRestaurantDetails } from "@/actions/restaurant/RestaurantDetails.action";
import { GetAllFoodsBasedOnRestaurant } from "@/actions/add-food/GetAllFoodsBasedOnRestaurant.action";
import { DeleteFood } from "@/actions/add-food/DeleteFood.action";
import { toast } from "sonner";

const trackFoodBasedOnRestaurantSchema = z.object({
  restaurantId: z.string().min(1, {
    message: "Please select a restaurant.",
  }),
});

const AddFoodPageComp = () => {
  const form = useForm<z.infer<typeof trackFoodBasedOnRestaurantSchema>>({
    resolver: zodResolver(trackFoodBasedOnRestaurantSchema),
    defaultValues: {
      restaurantId: "",
    },
  });

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurantsLoading, setRestaurantsLoading] = useState<boolean>(false);
  const [buttonLoadingDelete, setButtonLoadingDelete] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      setRestaurantsLoading(true);
      try {
        const response = await GetAllRestaurantDetails();
        if ("error" in response) {
          setError(response.error);
        } else {
          setRestaurants(response.data);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setRestaurantsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (foodId: string) => {
    setButtonLoadingDelete((prev) => ({ ...prev, [foodId]: true }));
    try {
      const result = await DeleteFood(foodId);
      if (result.statusCode === 200 && result.success) {
        setData((prev) => prev.filter((item) => item._id !== foodId));
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDelete((prev) => ({ ...prev, [foodId]: false }));
    }
  };

  const handleTrack = async (restaurantId: string) => {
    setLoading(true);
    try {
      const response = await GetAllFoodsBasedOnRestaurant(restaurantId);

      if ("error" in response) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  function onSubmit(values: z.infer<typeof trackFoodBasedOnRestaurantSchema>) {
    handleTrack(values.restaurantId.trim());
  }

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      <div className="my-10 grid place-items-center">
        <AddNewFoodFormSheetComponent>
          <Button className="w-72 max-w-96 h-12 text-[#0d0d0d] bg-[#fcac1c] hover:bg-[#fcac1c]/90">
            Add New Food
          </Button>
        </AddNewFoodFormSheetComponent>
      </div>

      <div className="mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-center gap-3">
            <div className="grow">
              <FormField
                control={form.control}
                name="restaurantId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-11 border border-gray-400">
                          <SelectValue placeholder="Select restaurant name to get all foods" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <ScrollArea>
                            {restaurantsLoading ? (
                              <div>
                                <ButtonLoadingAnimation text="Loading..." />
                              </div>
                            ) : restaurants.length > 0 ? (
                              <>
                                {restaurants?.map((restaurant) => (
                                  <SelectItem
                                    key={restaurant?.docId}
                                    value={restaurant?.docId}>
                                    {restaurant?.restaurantName}
                                  </SelectItem>
                                ))}
                              </>
                            ) : (
                              <div className="text-[10px] -translate-y-1 inline-block bg-yellow-500 text-black px-[14px] py-0.5 rounded-full">
                                No restaurants found
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
              disabled={loading}>
              {loading ? (
                <ButtonLoadingAnimation text="Tracking..." />
              ) : (
                "Track"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-10">
        <section>
          {loading && !error ? (
            <TableLoadingAnimation />
          ) : (
            <EditAndRemoveFoodDataTable
              data={data ? data : []}
              columns={EditAndRemoveFoodPageColumns({
                handleDelete,
                buttonLoadingDelete,
              })}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default AddFoodPageComp;
