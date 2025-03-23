import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ShowCustomerDetailsDialogOnOrderPage({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Showing <span className="font-semibold">{data?.name}</span> details.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-950">
                <th className="p-2 text-left border">Details</th>
                <th className="p-2 text-center border">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border flex flex-col gap-1">
                  <span>
                    Name :{" "}
                    <span className="font-semibold">
                      {data?.name || "❌❌❌"}
                    </span>
                  </span>
                  <span>
                    User Id :{" "}
                    <span className="font-semibold">
                      {data?.userId || "❌❌❌"}
                    </span>
                  </span>
                </td>
                <td className="p-2 border text-center">{data?.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
