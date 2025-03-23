import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowCustomerAddressComponentDialogOfRestaurantTablePage = ({
  children,
  addressData,
}: {
  children: React.ReactNode;
  addressData: any;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customer Name : {addressData?.name}</DialogTitle>
          <DialogDescription>
            Showing customer address and phone number.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-5">
          <span className="flex mb-1">
            <span className="text-sm mr-1.5">Customer Phone : </span>
            <span className="font-semibold">
              <div className="text-sm">
                ☎️ {addressData?.phone || "0000000000"}
              </div>
            </span>
          </span>
          <span className="flex">
            <span className="text-sm mr-1.5">Address : </span>
            <span className="font-semibold">
              <div className="text-sm">📍 {addressData?.addressLine1}</div>
            </span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowCustomerAddressComponentDialogOfRestaurantTablePage;
