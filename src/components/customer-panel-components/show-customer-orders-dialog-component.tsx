import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowCustomerOrdersComponentDialog = ({
  children,
  totalOrders,
  deliveredOrders,
  cancelledOrders,
  customerName,
}: {
  children: React.ReactNode;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  customerName: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Showing order details of <strong>{customerName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left border">Order Type</th>
                <th className="p-2 text-left border">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Total Orders</td>
                <td className="p-2 border">{totalOrders}</td>
              </tr>
              <tr>
                <td className="p-2 border">Delivered Orders</td>
                <td className="p-2 border">{deliveredOrders}</td>
              </tr>
              <tr>
                <td className="p-2 border">Cancelled Orders</td>
                <td className="p-2 border">{cancelledOrders}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowCustomerOrdersComponentDialog;
