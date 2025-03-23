import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

const RiderAllDeliveredOrdersSheetComponent = ({
  children,
  riderName,
  deliveredOrdersDetails,
}: {
  children: React.ReactNode;
  riderName: string;
  deliveredOrdersDetails: any;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full max-w-2xl overflow-scroll">
        <SheetHeader>
          <SheetTitle>Delivered Orders</SheetTitle>
          <SheetDescription>
            Showing all the delivered orders of {riderName || "Rider"}.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {deliveredOrdersDetails && deliveredOrdersDetails?.length > 0 ? (
            deliveredOrdersDetails?.map((item: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Order ID: {item.orderId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Delivered on:{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Total Amount : ₹ {item.totalAmount || 0}/-
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  {item.items.map((foodItem: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Image
                          width={100}
                          height={100}
                          src={foodItem.food.image}
                          alt={foodItem.food.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {foodItem.food.name} (x{foodItem.quantity})
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        ₹ {foodItem.price * foodItem.quantity || 0}/-
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <p>Restaurant: {item.restaurant.restaurantName}</p>
                  <p>User: {item.user.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No delivered orders found.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RiderAllDeliveredOrdersSheetComponent;
