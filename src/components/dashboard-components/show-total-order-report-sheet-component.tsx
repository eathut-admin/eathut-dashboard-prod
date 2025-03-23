import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorAnimation from "../loading-animations/Error-animation";

const ShowTotalOrderReportSheetComponent = ({
  children,
  data,
  title,
}: {
  children: React.ReactNode;
  data: any;
  title: string;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="light:bg-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Showing Total {title || ""} Order Report</SheetTitle>
        </SheetHeader>
        <div className="mt-16">
          {data && data.length > 0 ? (
            data.map((item: any, index: number) => (
              <div key={index} className="flex justify-between gap-3">
                <CardDesign item={item} />
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

export default ShowTotalOrderReportSheetComponent;

const CardDesign = ({ item }: { item: any }) => {
  return (
    <div className="dark:bg-[#e8e8e8] rounded-lg shadow-sm p-4 border border-gray-200 w-full mb-4 relative">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">
          Order Details
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Order ID:</span>
          <span className="text-sm font-medium text-gray-800">
            {item?.orderId}
          </span>
        </div>
      </div>

      <span
        className={`text-[10px] absolute top-4 right-4 px-2 py-0.5 font-semibold tracking-wide rounded-full ${
          item?.orderStatus === "CANCELLED"
            ? "bg-red-600 text-white"
            : "bg-green-600 text-white"
        }`}>
        {item?.orderStatus}
      </span>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Payment Status:</span>
          <span
            className={`text-[10px] px-2 py-0.5 font-semibold tracking-wide rounded-full ${
              item?.paymentStatus === "PENDING"
                ? "bg-yellow-500"
                : "bg-red-600 text-white"
            }`}>
            {item?.paymentStatus}
          </span>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-2">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Customer Details
          </h2>
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-800">
                {item?.deliveryAddress?.name}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Phone:</span>
              <span className="text-sm font-medium text-gray-800">
                {item?.deliveryAddress?.phone}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Address:</span>
              <span className="text-sm font-medium text-gray-800">
                {item?.deliveryAddress?.addressLine1}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Restaurant Details
          </h2>
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-800">
                {item?.restaurant?.name}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Restaurant Name:</span>
              <span className="text-sm font-medium text-gray-800">
                {item?.restaurant?.restaurantName}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-600">Phone:</span>
              <span className="text-sm font-medium text-gray-800">
                {item?.restaurant?.phone}
              </span>
            </div>
          </div>
        </div>
      </section>

      {item?.orderStatus === "CANCELLED" && (
        <div className="mt-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">Cancellation Reason:</span>
            <span className={`text-sm font-medium text-gray-800`}>
              {item?.cancellationReason}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
