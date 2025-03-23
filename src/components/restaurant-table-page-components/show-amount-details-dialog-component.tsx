import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowOrderAmountComponentDialogOfRestaurantTablePage = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] text-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Order Amounts
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Detailed information about the order amount.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-5">
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <span className="font-medium">Total Amount:</span> ₹{" "}
              {data?.totalAmount}
            </div>
            <div>
              <span className="font-medium">Delivery Fee:</span> ₹{" "}
              {data?.deliveryFee}
            </div>
            <div>
              <span className="font-medium">Discount:</span> ₹ {data?.discount}
            </div>
            <div>
              <span className="font-medium">Tax:</span> ₹ {data?.tax}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowOrderAmountComponentDialogOfRestaurantTablePage;
