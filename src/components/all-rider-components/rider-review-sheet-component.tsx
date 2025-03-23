"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorAnimation from "../loading-animations/Error-animation";
import { useEffect, useState } from "react";
import { GetAllReviewsBasedOnRestaurant } from "@/actions/restaurant/GetAllReviewsBasedOnRestaurant.action";
import Image from "next/image";

const RiderReviewSheetComponent = ({
  children,
  riderId,
  riderName,
}: {
  children: React.ReactNode;
  riderId: string;
  riderName: string;
}) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (riderId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await GetAllReviewsBasedOnRestaurant(
            riderId,
            "DELIVERY-PARTNER"
          );

          if ("error" in response) {
            setError(response.error);
          } else {
            setReviews(response);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [riderId]);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="light:bg-white overflow-scroll">
        <SheetHeader>
          <SheetTitle>Reviews for {riderName}</SheetTitle>
        </SheetHeader>
        <div className="mt-16">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="ml-2 h-4 bg-gray-200 rounded w-8"></div>
                  </div>

                  {/* Skeleton for Review Date */}
                  <div className="mt-4 h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-lg mb-4 p-6 border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        width={200}
                        height={200}
                        src={
                          review.userId.profileImage || "/default-avatar.png"
                        }
                        alt={review.userId.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {review.userId.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.userId.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center">
                    <div className="flex space-x-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-700 font-semibold">
                      {review.rating}.0
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-gray-400">
                    Reviewed on:{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ErrorAnimation massage={error || "Something went wrong"} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RiderReviewSheetComponent;
