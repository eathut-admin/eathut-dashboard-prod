import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ShowFoodPriceDialog({
  children,
  foodName,
  price,
}: {
  children: React.ReactNode;
  foodName: string;
  price: {
    mrp: number;
    companyShare: number;
    restaurantShare: number;
    discount: number;
    customerPrice: number;
  };
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{foodName} Price</DialogTitle>
        </DialogHeader>
        <div className="text-[15px] leading-6 py-3">
          <table className="table-auto w-full text-sm">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Maximum Retail Price
                </td>
                <td className="border px-4 py-2 flex justify-start gap-3">
                  <span>₹</span> {price?.mrp || "00.00"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Customer Price
                </td>
                <td className="border px-4 py-2 flex justify-start gap-3">
                  <span>₹</span> {price?.customerPrice || "00.00"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Discount</td>
                <td className="border px-4 py-2 flex justify-start gap-3">
                  {price?.discount || "00.00"} <span>%</span>
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Restaurant Share
                </td>
                <td className="border px-4 py-2 flex justify-start gap-3">
                  <span>₹</span> {price?.restaurantShare || "00.00"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Company Share
                </td>
                <td className="border px-4 py-2 flex justify-start gap-3">
                  <span>₹</span> {price?.companyShare || "00.00"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
