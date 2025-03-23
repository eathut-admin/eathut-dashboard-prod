import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowAdminDetailsDialog = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Details</DialogTitle>
          <DialogDescription>
            Showing details of admin {data?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start mt-3">
          <span>
            <span className="text-sm mr-1.5">Phone : </span>
            <span className="font-semibold">{data?.phone}</span>
          </span>
          <span>
            <span className="text-sm mr-1.5">Email : </span>
            <span className="font-semibold">{data?.email}</span>
          </span>
          <span>
            <span className="text-sm mr-1.5">Joining Date : </span>
            <span className="font-semibold">
              {new Date(data?.joinedAt).toLocaleDateString("gb-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </span>
          <span className="flex">
            <span className="text-sm mr-1.5">Address : </span>
            <span className="font-semibold">
              <div className="text-sm">
                📍{" "}
                {[
                  data?.address?.street,
                  data?.address?.area,
                  data?.address?.city,
                  data?.address?.state,
                  data?.address?.pincode,
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

export default ShowAdminDetailsDialog;
