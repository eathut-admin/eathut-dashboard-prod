import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorAnimation from "../loading-animations/Error-animation";

const CustomerUsedOfferSheetComponent = ({
  children,
  customerName,
  offerData,
}: {
  children: React.ReactNode;
  customerName: string;
  offerData: any;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full max-w-2xl overflow-scroll">
        <SheetHeader>
          <SheetTitle>Used Offers</SheetTitle>
          <SheetDescription>
            Showing all the used offers of {customerName || "customer"}.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8">
          {offerData?.length > 0 ? (
            offerData.map((offer: any) => (
              <div
                key={offer._id}
                className="mb-6 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">{offer.title}</h3>
                <p className="text-sm text-gray-600">{offer.description}</p>
                <div className="mt-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Offer ID:</span>
                    <span className="">{offer.offerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Valid From:</span>
                    <span className="">
                      {new Date(offer.validFrom).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Valid Until:</span>
                    <span className="">
                      {new Date(offer.validUntil).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Minimum Order Amount:</span>
                    <span className="">{offer.minOrderAmount}</span>
                  </div>

                  {offer.discount.percentage && (
                    <div className="flex justify-between">
                      <span className="font-medium">Discount:</span>
                      <span className="">{offer.discount.percentage}%</span>
                    </div>
                  )}
                  {offer.freeItems.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Free Items:</p>
                      <ul className="list-disc list-inside">
                        {offer.freeItems.map((item: any) => (
                          <li key={item._id} className="text-sm">
                            {item.name} (₹{item.price})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ErrorAnimation massage={`No offers used by ${customerName}`} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerUsedOfferSheetComponent;
