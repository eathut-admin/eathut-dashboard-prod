"use client";

import { useEffect, useState } from "react";
import ErrorAnimation from "@/components/loading-animations/Error-animation";
import { GetAllFoodsBasedOnRestaurant } from "@/actions/add-food/GetAllFoodsBasedOnRestaurant.action";
import Image from "next/image";
import { Drumstick, Leaf } from "lucide-react";
import FoodCardLoadingAnimation from "@/components/loading-animations/Food-card-loading-animation";

const RestaurantAllItemsDetails = ({
  params,
}: {
  params: { docId: string };
}) => {
  const { docId } = params;
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response = await GetAllFoodsBasedOnRestaurant(docId || "");

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
  }, [docId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7 mt-12">
        {Array.from({ length: 10 }).map((_, index) => (
          <FoodCardLoadingAnimation key={index} />
        ))}
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error || "No items found"} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      <div className="mt-12">
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-10 underline underline-offset-2">
          Showing all food items available on restaurant{" "}
          <strong>{data[0]?.restaurant?.restaurantName}</strong>{" "}
        </h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7 text-black dark:text-white">
          {data?.map((food, _id) => (
            <div key={_id + Math.random()}>
              <div className="flex flex-col gap-3 border rounded-md min-h-full">
                <div className="bg-black w-full h-52 aspect-square rounded-md overflow-hidden relative">
                  <Image
                    src={food?.image}
                    alt={_id.toString()}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-[#fff] px-5 py-1 text-sm rounded-tl-md font-semibold text-black min-w-16">
                    Customer price: ₹ {food?.price?.customerPrice || "00.00"}
                  </span>
                </div>
                <div className="p-3">
                  <span
                    title={food?.vegOrNonVeg?.toLowerCase()}
                    className={`inline-block mb-3 p-2 box-border rounded-full cursor-pointer ${
                      food?.vegOrNonVeg === "VEG"
                        ? "bg-[#7fb222]"
                        : "bg-[#fcac1c]"
                    }`}>
                    {food?.vegOrNonVeg === "VEG" ? (
                      <Leaf size={20} />
                    ) : (
                      <Drumstick size={20} />
                    )}
                  </span>
                  <p className="text-xs uppercase">{food?.category?.name}</p>
                  <p className="text-base font-semibold">{food?.name}</p>
                  <p className="text-sm mt-2">{food?.description}</p>
                  <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 grid md:grid-cols-2 gap-0.5">
                    <p>MRP: ₹ {food?.price?.mrp || "00.00"}</p>
                    <p>Discount: {food?.price?.discount || "0"} %</p>
                    <p>
                      Restaurant Share: ₹{" "}
                      {food?.price?.restaurantShare || "00.00"}
                    </p>
                    <p>
                      Company Share: ₹ {food?.price?.companyShare || "00.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default RestaurantAllItemsDetails;
