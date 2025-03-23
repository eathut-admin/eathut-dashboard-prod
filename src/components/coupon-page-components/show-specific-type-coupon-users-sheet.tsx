import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import ErrorAnimation from "../loading-animations/Error-animation";
import Image from "next/image";

const ShowSpecificTypeCouponUsersSheet = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="light:bg-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Specific Coupon Users</SheetTitle>
          <SheetDescription>
            Showing users data who have permission to use this coupon.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-16">
          {data && data?.length > 0 ? (
            data?.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between gap-5 border p-3 relative">
                <span
                  className={`absolute top-1.5 right-2 py-0.5 px-3 text-xs text-white rounded-full ${
                    item?.blocked ? "bg-red-600" : "bg-green-600"
                  }`}>
                  {item?.blocked ? "Blocked" : "Active"}
                </span>

                <div className="flex items-center gap-3 min-w-full">
                  <Image
                    src={item?.profileImage}
                    alt=""
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full"></Image>

                  <div className="flex flex-col justify-center gap-0.5 text-[12.5px]">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600">Customer Name:</span>
                      <span className="font-semibold tracking-widest">
                        {item?.name}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600">User Id:</span>
                      <span className="font-semibold tracking-widest">
                        {item?.userId}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold tracking-widest">
                        {item?.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ErrorAnimation massage={"Something went wrong"} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShowSpecificTypeCouponUsersSheet;
