import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowCustomerAddressComponentDialog = ({
  children,
  addressData,
  customerName,
}: {
  children: React.ReactNode;
  addressData: any;
  customerName: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Address Details</DialogTitle>
          <DialogDescription>
            Showing address of <strong>{customerName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div>
          <span className="flex">
            <span className="text-sm mr-1.5">Address : </span>
            <span className="font-semibold">
              <div className="text-sm">
                📍{" "}
                {[
                  addressData?.street,
                  addressData?.area,
                  addressData?.city,
                  addressData?.state,
                  addressData?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowCustomerAddressComponentDialog;
