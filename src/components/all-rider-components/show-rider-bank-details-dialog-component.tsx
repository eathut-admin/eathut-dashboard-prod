import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowRiderBankDetailsComponentDialog = ({
  children,
  riderName,
  bankDetails,
}: {
  children: React.ReactNode;
  riderName: string;
  bankDetails: any;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bank Details</DialogTitle>
          <DialogDescription>
            Showing <span className="font-semibold">{riderName}</span> bank
            details.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-950">
                <th className="p-2 text-left border">Bank Details</th>
                <th className="p-2 text-center border">Account Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border flex flex-col gap-1">
                  <span>
                    Bank Name :{" "}
                    <span className="font-semibold">
                      {bankDetails.bankName || "❌❌❌"}
                    </span>
                  </span>
                  <span>
                    IFSC Code :{" "}
                    <span className="font-semibold">
                      {bankDetails.ifscCode || "❌❌❌"}
                    </span>
                  </span>
                </td>
                <td className="p-2 border text-center">
                  {bankDetails.accountNumber}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowRiderBankDetailsComponentDialog;
