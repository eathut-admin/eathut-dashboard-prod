import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorAnimation from "../loading-animations/Error-animation";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const RestaurantCashWithdrawalSheetComponent = ({
  children,
  ownerName,
  ownerEmail,
  restaurantName,
  loading,
  error,
  withdrawalHistory,
}: {
  children: React.ReactNode;
  loading: boolean;
  ownerName: string;
  ownerEmail: string;
  error: string | null;
  restaurantName: string;
  withdrawalHistory: any;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="light:bg-white overflow-scroll">
        <SheetHeader>
          <SheetTitle>Restaurant Cash Withdrawal</SheetTitle>
          <SheetDescription>
            Showing {restaurantName}&apos;s cash withdrawal details.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-16">
          {loading ? (
            <div className="space-y-4">
              {[withdrawalHistory.length].map((_, index) => (
                <div key={index} className="w-full text-xs">
                  <div className="flex items-center justify-between space-x-4 mb-4 border-b pb-2">
                    <div>
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48 mt-2" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ErrorAnimation massage={"Something went wrong"} />
            </div>
          ) : withdrawalHistory && withdrawalHistory.length > 0 ? (
            withdrawalHistory.map((item: any, index: number) => (
              <div key={index} className="grid gap-10">
                <RestaurantOwnerCard
                  data={item}
                  restaurantName={restaurantName}
                  ownerName={ownerName}
                  ownerEmail={ownerEmail}
                />
              </div>
            ))
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ErrorAnimation massage={"No data found"} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RestaurantCashWithdrawalSheetComponent;

const RestaurantOwnerCard = ({
  data,
  ownerName,
  ownerEmail,
  restaurantName,
}: {
  data: any;
  ownerName: string;
  ownerEmail: string;
  restaurantName: string;
}) => {
  const handlePrintBill = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a6",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, 150, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Restaurant Bill", 60, 10);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    doc.setFontSize(12);
    doc.text(`Restaurant: ${restaurantName}`, 10, 25);
    doc.setFontSize(10);
    doc.text(`Owner: ${ownerName}`, 10, 30);
    doc.text(`Email: ${ownerEmail}`, 10, 35);

    doc.setDrawColor(200, 200, 200);
    doc.line(10, 40, 140, 40);

    doc.text(`Amount: ${data.amount}/-`, 10, 45);
    doc.text(`Status: ${data.status}`, 10, 50);
    doc.text(`Bank: ${data.paymentInfo.bankName}`, 10, 55);
    doc.text(`Account Number: ${data.paymentInfo.accountNumber}`, 10, 60);
    doc.text(`IFSC Code: ${data.paymentInfo.ifscCode}`, 10, 65);

    doc.text(
      `Date: ${new Date(data.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      10,
      70
    );

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", 10, 85);

    doc.save(
      `bill_${restaurantName.toLowerCase()}_${new Date().getTime()}.pdf`
    );
  };

  // const handleDelete = async (billId: string) => {
  //   console.log("Bill Id : ", billId);
  //   try {
  //     // Api Call delete user from database
  //     // const result = await deleteUser(billId);
  //     const result = {};
  //     if (result) {
  //       // toast.success(result.message);
  //     } else {
  //       // throw new Error(result.error);
  //     }
  //   } catch (error: any) {
  //     // toast.error(error.message);
  //   }
  // };

  return (
    <div className="w-full text-xs">
      <div>
        <div className="flex items-center justify-between space-x-4 mb-4 border-b pb-2">
          <div>
            <h3 className="text-lg font-semibold">{restaurantName}</h3>
            <p className="text-sm">{ownerEmail}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {/* <DeleteAlertDialog
                onConfirm={() => handleDelete(data?._id)}
                onCancel={() => {}}
                name={`this bill => ${new Date(
                  data.createdAt
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}`}>
                <Button variant="destructive" size="icon" disabled={false}>
                  {false ? (
                    <ButtonLoadingAnimation text="" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </Button>
              </DeleteAlertDialog> */}
              <Button size="icon" onClick={handlePrintBill}>
                <Download size={20} />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="">Amount:</span>
            <span className="font-medium">₹ {data.amount}/-</span>
          </div>
          <div className="flex justify-between">
            <span className="">Status:</span>
            <span
              className={`font-medium ${
                data.status === "PENDING" ? "text-yellow-500" : "text-green-500"
              }`}>
              {data.status.toLowerCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="">Bank:</span>
            <span className="font-medium">{data.paymentInfo.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="">Account Number:</span>
            <span className="font-medium">
              {data.paymentInfo.accountNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="">IFSC Code:</span>
            <span className="font-medium">{data.paymentInfo.ifscCode}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <span className="">Date:</span>
        <span className="font-medium">
          {new Date(data.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};
