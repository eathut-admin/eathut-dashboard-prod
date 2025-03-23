import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export function RestaurantInformationWithOwnerDetailsDialog({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  const address = data?.restaurantAddress;
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Restaurant Information</DialogTitle>
          <DialogDescription>
            Detailed information about restaurant {data?.restaurantName}
          </DialogDescription>
        </DialogHeader>
        <section>
          <div>
            <Image
              src={data?.imageUrl}
              width={400}
              height={400}
              alt={data?.restaurantName}
              className="w-full h-44 object-fill object-center rounded-md"></Image>
          </div>

          <section className="relative">
            <span
              className={`absolute -top-2 right-0 text-[9px] px-3 py-[3px] rounded-full font-semibold tracking-wider ${
                data?.availability
                  ? "bg-green-500 text-black"
                  : "bg-red-500 text-white"
              }`}>
              {data.availability ? "OPEN" : "CLOSED"}
            </span>
            <div className="mt-4 text-sm">
              <div className="flex items-center gap-3 mb-1.5">
                <Image
                  src="/home/shop.svg"
                  width={25}
                  height={25}
                  alt="open"></Image>
                <h2 className="text-xl font-bold translate-y-1">
                  {data?.restaurantName}
                </h2>
              </div>
              <p className="mb-2">{data?.restaurantType}</p>
              <div className="flex flex-wrap gap-1 my-3">
                {address?.street && (
                  <>
                    <span>
                      <span className="text-sm">Street : </span>
                      <span className="font-semibold">{address?.street}</span>
                    </span>
                    ,
                  </>
                )}
                {address?.area && (
                  <>
                    <span>
                      <span className="text-sm">Area : </span>
                      <span className="font-semibold">{address?.area}</span>
                    </span>
                    ,
                  </>
                )}
                <span>
                  <span className="text-sm">City : </span>
                  <span className="font-semibold">{address?.city}</span>
                </span>
                ,
                <span>
                  <span className="text-sm">State : </span>
                  <span className="font-semibold">{address?.state}</span>
                </span>
                ,
                <span>
                  <span className="text-sm">Pin Code : </span>
                  <span className="font-semibold">{address?.pincode}</span>
                </span>
              </div>
              <div className="font-bold text-[10px] flex gap-2 items-center">
                <span className="mb-2 flex max-w-fit text-[#fff] bg-[#09661e] px-3 py-1 rounded-md items-center gap-1">
                  <span>{data?.overallRating}</span>
                  <FaStar className="" />
                </span>
                <span className="text-[11px]">
                  ({data?.totalRating} ratings)
                </span>
              </div>
              <div className="flex justify-between">
                <p>
                  <strong>Delivery Time :</strong> {data?.deliveryTime}
                </p>
                <p>
                  <strong>Average Price :</strong> {data?.averagePrice}/-
                </p>
              </div>
            </div>
          </section>

          <div className="text-xs mt-8">
            <h3 className="text-sm font-semibold underline mb-1">
              Owner details
            </h3>
            <div className="text-xs grid grid-cols-2">
              <span className="border py-1 px-3">
                {data?.ownerDetails?.name}
              </span>
              <span className="border py-1 px-3 border-l-0">
                {data?.ownerDetails?.phone}
              </span>
              <span className="border border-t-0 py-1 px-3 col-span-2">
                {data?.ownerDetails?.email}
              </span>
            </div>
          </div>
        </section>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
