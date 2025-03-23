import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowOfferDetailsComponentDialog = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Offer Details
          </DialogTitle>
          <DialogDescription>
            View offer details here. Click outside to close when done.
          </DialogDescription>
        </DialogHeader>
        <section className="space-y-4 text-sm text-gray-700 dark:text-gray-300 pt-8">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Offer Type</span>
            <span className="text-gray-900 dark:text-gray-100">
              {data?.offerType}
            </span>
          </div>

          {data?.minOrderAmount && (
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium">Minimum Order</span>
              <span className="text-gray-900 dark:text-gray-100">
                ₹{data?.minOrderAmount}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Free Delivery</span>
            <span className="text-gray-900 dark:text-gray-100">
              {data?.freeDelivery ? "Yes" : "No"}
            </span>
          </div>

          <div className="space-y-2 border-b pb-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Valid From</span>
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(data?.validFrom).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Expires On</span>
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(data?.validUntil).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {data?.freeItems && data.freeItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Free Items</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-1">Item</th>
                    <th className="py-1">Quantity</th>
                    <th className="py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.freeItems.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-1.5">{item.name}</td>
                      <td className="py-1.5">{item.quantity}</td>
                      <td className="py-1.5 text-right">₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-medium">Discount</span>
            {data?.discount?.percentage !== null ? (
              <span className="text-gray-900 dark:text-gray-100">
                {data.discount.percentage}% Off
              </span>
            ) : data?.discount?.flatAmount !== null ? (
              <span className="text-gray-900 dark:text-gray-100">
                ₹{data.discount.flatAmount} Off
              </span>
            ) : (
              <span className="text-gray-900 dark:text-gray-100">
                No Discount
              </span>
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ShowOfferDetailsComponentDialog;
