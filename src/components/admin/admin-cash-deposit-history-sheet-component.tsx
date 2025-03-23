import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorAnimation from "../loading-animations/Error-animation";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { GetAdminCashDepositHistory } from "@/actions/cash-deposit/GetAdminCashDepositHistory.actio";

const AdminCashDepositHistorySheetComponent = ({
  children,
  adminId,
  adminName,
  adminPhone,
  adminAddress,
  adminEmail,
}: {
  children: React.ReactNode;
  adminId: string;
  adminName: string;
  adminPhone: string;
  adminAddress: any;
  adminEmail: string;
}) => {
  const [adminDepositHistory, setAdminDepositHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const adminDepositResponse = await GetAdminCashDepositHistory(adminId);

        if ("error" in adminDepositResponse) {
          setError(adminDepositResponse.error);
        } else {
          setAdminDepositHistory(adminDepositResponse.data);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [adminId]);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="light:bg-white overflow-scroll">
        <SheetHeader>
          <SheetTitle>Admin Cash Deposit History</SheetTitle>
          <SheetDescription>
            Showing {adminName || "Admin"}&apos;s cash deposit details.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-16">
          {loading ? (
            <div className="space-y-4">
              {[adminDepositHistory.length].map((_, index) => (
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
          ) : adminDepositHistory && adminDepositHistory.length > 0 ? (
            adminDepositHistory.map((item: any, index: number) => (
              <div
                key={index}
                className="grid gap-5 border p-4 rounded-md mb-5">
                <RestaurantOwnerCard
                  data={item}
                  adminName={adminName}
                  adminAddress={adminAddress}
                  adminPhone={adminPhone}
                  adminEmail={adminEmail}
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

export default AdminCashDepositHistorySheetComponent;

const RestaurantOwnerCard = ({
  data,
  adminName,
  adminAddress,
  adminPhone,
  adminEmail,
}: {
  data: any;
  adminName: string;
  adminAddress: any;
  adminEmail: string;
  adminPhone: string;
}) => {
  const handlePrintBill = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a6",
    });

    doc.setFont("helvetica", "normal");

    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    const headerText = "Admin Deposit Bill";
    const textWidth = doc.getTextWidth(headerText);
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = (pageWidth - textWidth) / 2;
    doc.text(headerText, centerX, 8);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Admin Details", 10, 18);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${adminName}`, 10, 23);
    doc.text(`Phone: ${adminPhone}`, 10, 28);
    doc.text(`Email: ${adminEmail}`, 10, 33);

    const addressParts = [
      adminAddress.street,
      adminAddress.city,
      adminAddress.state,
      adminAddress.pincode,
    ].filter(Boolean);

    const formattedAddress = addressParts.join(", ");

    const maxWidth = 40;
    const addressLines = doc.splitTextToSize(
      `Address: ${formattedAddress}`,
      maxWidth
    );

    doc.text(addressLines, 10, 38);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 60, 18);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Amount: Rs. ${data.amount}/-`, 60, 23);
    doc.text(`Status: ${data.status}`, 60, 28);
    doc.text(`Bank: ${data.paymentInfo.bankName}`, 60, 33);
    doc.text(`Account Number: ${data.paymentInfo.accountNumber}`, 60, 38);
    doc.text(`IFSC Code: ${data.paymentInfo.ifscCode}`, 60, 43);
    doc.text(
      `Date: ${new Date(data.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      60,
      48
    );

    doc.setDrawColor(200, 200, 200);
    doc.line(10, 55, doc.internal.pageSize.getWidth() - 10, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Currency Count", 10, 62);

    doc.autoTable({
      startY: 67,
      head: [["Denomination", "Count"]],
      body: Object.entries(data.currencyCount).map(([denomination, count]) => [
        `Rs. ${denomination}`,
        count,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        cellPadding: 1,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      styles: {
        fontSize: 7,
        cellPadding: 0.5,
      },
      margin: { left: 10, right: 10 },
    });

    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Thank you for your business!",
      52.5,
      doc.autoTable.previous.finalY + 5,
      { align: "center" }
    );
    doc.text(
      "For any queries, contact eathutfooddelivery@gmail.com",
      52.5,
      doc.autoTable.previous.finalY + 10,
      { align: "center" }
    );

    doc.save(`deposit_bill_${adminName || ""}_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="w-full text-sm mb-10">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div>
          <h3 className="text-lg font-semibold">{adminName || ""}</h3>
          <p className="text-sm">{adminEmail || ""}</p>
        </div>
        <Button size="icon" onClick={handlePrintBill}>
          <Download size={20} />
        </Button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="">Amount:</span>
          <span className="font-medium">₹ {data?.amount || ""}/-</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-medium text-green-500">completed</span>
        </div>
        <div className="flex justify-between">
          <span className="">Bank:</span>
          <span className="font-medium">{data?.paymentInfo?.bankName}</span>
        </div>
        <div className="flex justify-between">
          <span className="">Account Number:</span>
          <span className="font-medium">
            {data?.paymentInfo?.accountNumber}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="">IFSC Code:</span>
          <span className="font-medium">{data?.paymentInfo?.ifscCode}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <span className="">Date:</span>
        <span className="font-medium">
          {new Date(data?.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="mt-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-950 ">
              <th className="border px-4 py-2 text-left">Denomination</th>
              <th className="border px-4 py-2 text-center">Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data?.currencyCount).map(
              ([denomination, count]) => (
                <tr key={denomination}>
                  <td className="border px-4 py-2">₹ {denomination}</td>
                  <td className="border px-4 py-2 font-medium text-center">
                    {count as number}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
