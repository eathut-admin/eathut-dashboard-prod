import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorAnimation from "../loading-animations/Error-animation";

const ShowRiderReportSheetComponent = ({
  children,
  todayDate,
  data,
  title,
}: {
  children: React.ReactNode;
  todayDate: string;
  data: any;
  title: string;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="light:bg-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Showing Total {title || ""} Rider Report</SheetTitle>
          <SheetDescription>Today : {todayDate}</SheetDescription>
        </SheetHeader>
        <div className="mt-16">
          {data && data?.length > 0 ? (
            data?.map((rider: any, index: number) => (
              <div key={index} className="flex justify-between gap-3">
                <CardDesign rider={rider} />
              </div>
            ))
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ErrorAnimation massage={"Something went wrong"} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShowRiderReportSheetComponent;

const CardDesign = ({ rider }: { rider: any }) => {
  return (
    <div className="dark:bg-[#e8e8e8] rounded-lg shadow-sm p-4 border border-gray-200 w-full mb-4 relative">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">
          Rider Details
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Order ID:</span>
          <span className="text-sm font-medium text-gray-800">
            {rider?.userId}
          </span>
        </div>
      </div>

      <span
        className={`text-[10px] absolute top-4 right-4 px-2 py-0.5 font-semibold tracking-wide rounded-full ${
          rider?.availability === "UNAVAILABLE"
            ? "bg-red-600 text-white"
            : "bg-green-600 text-white"
        }`}>
        {rider?.availability}
      </span>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Order Wallet Balance:</span>
          <span className={`text-sm font-medium text-gray-800`}>
            ₹ {rider?.orderWalletBalance || "00.00"}/-
          </span>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-2">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Contact Details
          </h2>
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-800">
                {rider?.name}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Phone:</span>
              <span className="text-sm font-medium text-gray-800">
                {rider?.phone}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Address:</span>
              <span className="text-sm font-medium text-gray-800">
                {[
                  rider?.address?.street,
                  rider?.address?.area,
                  rider?.address?.city,
                  rider?.address?.state,
                  rider?.address?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Vehicle Details
          </h2>
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Vehicle Type:</span>
              <span className="text-sm font-medium text-gray-800">
                {rider?.vehicleDetails?.vehicleType}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">
                Registration Number:
              </span>
              <span className="text-sm font-medium text-gray-800">
                {rider?.vehicleDetails?.registrationNumber}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Insurance Details:</span>
              <span className="text-sm font-medium text-gray-800">
                {rider?.vehicleDetails?.insuranceDetails}
              </span>
            </div>
          </div>
        </div>
      </section>

      {rider?.orderStatus === "CANCELLED" && (
        <div className="mt-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">Cancellation Reason:</span>
            <span className={`text-sm font-medium text-gray-800`}>
              {rider?.cancellationReason}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
