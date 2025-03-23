import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import ShowSpecificTypeCouponUsersSheet from "./show-specific-type-coupon-users-sheet";

export function ShowCouponDetailsDialog({
  children,
  couponDetails,
}: {
  children: React.ReactNode;
  couponDetails: any;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{couponDetails?.code}</DialogTitle>
        </DialogHeader>
        <div className="text-[15px] leading-6 py-3">
          <table className="table-auto w-full text-sm">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Coupon Type</td>
                <td className="border px-4 py-2 flex justify-between items-center gap-3">
                  {couponDetails?.type || "not found"}
                  {couponDetails?.type === "SPECIFIC" && (
                    <ShowSpecificTypeCouponUsersSheet
                      data={
                        couponDetails?.userSpecific
                          ? couponDetails?.userSpecific
                          : []
                      }>
                      <Button className="h-7 max-w-16" variant="outline">
                        View
                      </Button>
                    </ShowSpecificTypeCouponUsersSheet>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Discount Type
                </td>
                <td className="border px-4 py-2 flex justify-start gap-3">
                  {couponDetails?.discountType || "not found"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Discount Value
                </td>
                <td className="border px-4 py-2 flex justify-start gap-3">
                  {couponDetails?.discountType === "PERCENTAGE" ? (
                    <>
                      {couponDetails?.discountValue || "not found"}{" "}
                      <span>%</span>
                    </>
                  ) : (
                    <>
                      <span>₹</span>{" "}
                      {couponDetails?.discountValue || "not found"}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Minimum Order Value
                </td>
                <td className="border px-4 py-2 flex justify-start gap-3">
                  <span>₹</span> {couponDetails?.minOrderValue || "not found"}
                </td>
              </tr>
              {couponDetails?.maxDiscountValue > 0 && (
                <tr>
                  <td className="border px-4 py-2 font-semibold">
                    Maximum Discount Value
                  </td>
                  <td className="border px-4 py-2 flex justify-start gap-3">
                    <span>₹</span>{" "}
                    {couponDetails?.maxDiscountValue || "not found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
