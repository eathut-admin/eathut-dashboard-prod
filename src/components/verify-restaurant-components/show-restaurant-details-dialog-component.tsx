import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const ShowRestaurantDetailsComponentDialog = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {data?.restaurantName}
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-600">
            <span className="flex items-center text-sm">
              <span className="text-gray-500 mr-1.5">Address:</span>
              <span className="font-semibold flex items-center">
                <span className="mr-1">📍</span>
                <span>
                  {[
                    data?.address?.street,
                    data?.address?.area,
                    data?.address?.city,
                    data?.address?.state,
                    data?.address?.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <section className="mt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full">
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={data?.profileImage}
                  alt={data?.restaurantName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  About the Restaurant
                </h3>
                <div className="space-y-0.5 text-xs text-gray-600">
                  <p>
                    <span className="font-medium">Restaurant Type:</span>{" "}
                    <span className="font-semibold text-sm">
                      {data?.restaurantType}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Average Price:</span>{" "}
                    <span className="font-semibold text-sm">
                      ₹ {data?.averagePrice}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Delivery Time:</span>{" "}
                    <span className="font-semibold text-sm">
                      {data?.deliveryTime}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ShowRestaurantDetailsComponentDialog;
