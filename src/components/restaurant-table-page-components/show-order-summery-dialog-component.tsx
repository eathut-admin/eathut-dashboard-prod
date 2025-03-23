import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const ShowOrderSummeryComponentDialogOfRestaurantTablePage = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) => {
  const getPaymentStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-orange-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "REFUNDED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] text-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Order Summary
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Detailed information about the order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {data?.cancellationReason && (
            <div>
              <span className="text-sm">🚫 {data?.cancellationReason}</span>
            </div>
          )}

          {data?.cancellationReason && <Separator />}

          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Payment Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Payment Method:</span>{" "}
                {data?.paymentMethod}
              </div>
              <div>
                <span className="font-medium">Payment Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${getPaymentStatusBadgeStyles(
                    data?.paymentStatus
                  )}`}>
                  {data?.paymentStatus?.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* <Separator /> */}

          {/* <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Order Amounts
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Total Amount:</span> ₹{" "}
                {data?.totalAmount}
              </div>
              <div>
                <span className="font-medium">Delivery Fee:</span> ₹{" "}
                {data?.deliveryFee}
              </div>
              <div>
                <span className="font-medium">Discount:</span> ₹{" "}
                {data?.discount}
              </div>
              <div>
                <span className="font-medium">Tax:</span> ₹ {data?.tax}
              </div>
            </div>
          </div> */}

          <Separator />

          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Items Ordered
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((item: any, idx: number) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                        {item?.food.name}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                        {item?.quantity}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                        ₹ {item?.price}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                        ₹ {item?.quantity * item?.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowOrderSummeryComponentDialogOfRestaurantTablePage;
