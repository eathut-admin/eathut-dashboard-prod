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

export function ShowRestaurantDetailsDialogOnOrderPage({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
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
            <p className="mb-2">
              Phone : <span className="font-semibold">{data?.phone}</span>
            </p>
          </div>
        </section>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
