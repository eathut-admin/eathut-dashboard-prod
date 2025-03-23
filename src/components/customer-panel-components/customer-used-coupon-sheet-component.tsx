import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorAnimation from "../loading-animations/Error-animation";

const CustomerUsedCouponSheetComponent = ({
  children,
  customerName,
  couponData,
}: {
  children: React.ReactNode;
  customerName: string;
  couponData: any;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full max-w-2xl overflow-scroll">
        <SheetHeader>
          <SheetTitle>Used Coupons</SheetTitle>
          <SheetDescription>
            Showing all the used coupons of {customerName || "customer"}.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8">
          {couponData && couponData.length > 0 ? (
            <div className="grid grid-cols-2 gap-10">
              {couponData.map((coupon: any) => (
                <div key={coupon._id} className="relative">
                  <div
                    className={`absolute top-1.5 right-0 text-xs px-2 rounded-full text-white ${
                      coupon.isActive ? "bg-green-500" : "bg-red-500"
                    }`}>
                    {coupon.isActive ? "active" : "inactive"}
                  </div>
                  <h3 className="text-lg font-bold text-[#7fb222] mb-4">
                    {coupon.code}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Discount Type:</span>
                      <span className="">{coupon.discountType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Discount:</span>
                      <span className="">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `${coupon.discountValue}/-`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Expiry Date:</span>
                      <span className="">
                        {new Date(coupon.expiryDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Min Order Value:</span>
                      <span className="">{coupon.minOrderValue}/-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Coupon Type:</span>
                      <span className="">
                        {coupon.type.toLowerCase().trim()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ErrorAnimation massage="No used coupons found" />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerUsedCouponSheetComponent;
