import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowRiderDetailsDialog = ({
  children,
  riderData,
}: {
  children: React.ReactNode;
  riderData: any;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rider Details</DialogTitle>
          <DialogDescription>
            Showing{" "}
            <span className="font-semibold">{riderData?.entityId?.name}</span>{" "}
            details.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-950">
                <th className="p-2 text-left border">Details</th>
                <th className="p-2 text-center border">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border flex flex-col gap-1">
                  <span>
                    Name :{" "}
                    <span className="font-semibold">
                      {riderData?.entityId?.name || "❌❌❌"}
                    </span>
                  </span>
                  <span>
                    Email :{" "}
                    <span className="font-semibold">
                      {riderData?.entityId?.email || "❌❌❌"}
                    </span>
                  </span>
                </td>
                <td className="p-2 border text-center">
                  {riderData?.entityId?.role}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowRiderDetailsDialog;
