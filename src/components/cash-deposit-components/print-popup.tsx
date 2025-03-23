import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { RxCross2 } from "react-icons/rx";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DepositData {
  totalAmount: number;
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
  currencyCount: {
    [key: string]: number;
  };
}

interface PrintPopupProps {
  depositData: DepositData;
  adminData: any;
  onClose: () => void;
  onSubmit: () => void;
}

const PrintPopup: React.FC<PrintPopupProps> = ({
  depositData,
  adminData,
  onClose,
  onSubmit,
}) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a6",
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Eathut Deposit Receipt", 52.5, 10, { align: "center" });

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Your Trusted Food Delivery Partner", 52.5, 15, {
      align: "center",
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(10, 18, 95, 18);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Admin Details", 10, 25);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${adminData.name}`, 10, 30);
    doc.text(`Phone: ${adminData.phone}`, 10, 35);
    doc.text(`Email: ${adminData.email}`, 10, 40);

    const addressParts = [
      adminData.address.street,
      adminData.address.city,
      adminData.address.state,
      adminData.address.pincode,
    ].filter(Boolean);

    const formattedAddress = addressParts.join(", ");

    const maxWidth = 40;
    const addressLines = doc.splitTextToSize(
      `Address: ${formattedAddress}`,
      maxWidth
    );

    doc.text(addressLines, 10, 45);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Deposit Details", 60, 25);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Cash: Rs. ${depositData.totalAmount}`, 60, 30);
    doc.text(`Bank Name: ${depositData.paymentInfo.bankName}`, 60, 35);
    doc.text(
      `Account Number: ${depositData.paymentInfo.accountNumber}`,
      60,
      40
    );
    doc.text(`IFSC Code: ${depositData.paymentInfo.ifscCode}`, 60, 45);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Currency Count", 10, 60);

    doc.autoTable({
      startY: 65,
      head: [["Denomination", "Count"]],
      body: Object.entries(depositData.currencyCount).map(
        ([denomination, count]) => [`Rs. ${denomination}`, count]
      ),
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
        fontSize: 6,
        cellPadding: 0.5,
      },
      margin: { left: 10, right: 10 },
    });

    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you for choosing Eathut!",
      52.5,
      doc.autoTable.previous.finalY + 5,
      { align: "center" }
    );
    doc.text(
      "If you have any questions, please contact eathutfooddelivery@gmail.com",
      52.5,
      doc.autoTable.previous.finalY + 10,
      { align: "center" }
    );

    doc.save("eathut-deposit-receipt.pdf");

    onSubmit();
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[50]">
      <div className="rounded-lg bg-white dark:bg-[#030303] text-black dark:text-white p-6 w-[450px] shadow-lg border">
        <h2 className="text-xl font-bold mb-8 text-center underline">
          Eathut Deposit Receipt
        </h2>

        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="font-semibold w-1/2">Total Cash:</td>
              <td className="text-green-600">₹{depositData.totalAmount}</td>
            </tr>
            <tr>
              <td className="font-semibold">Bank Name:</td>
              <td>{depositData.paymentInfo.bankName}</td>
            </tr>
            <tr>
              <td className="font-semibold">Account Number:</td>
              <td>{depositData.paymentInfo.accountNumber}</td>
            </tr>
            <tr>
              <td className="font-semibold">IFSC Code:</td>
              <td>{depositData.paymentInfo.ifscCode}</td>
            </tr>
          </tbody>
        </table>

        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-3 border py-2">Denomination</th>
              <th className="text-center px-3 border py-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {depositData.currencyCount ? (
              Object.entries(depositData.currencyCount).map(
                ([denomination, count]) => (
                  <tr key={denomination}>
                    <td className="border text-left px-3 py-2">
                      {denomination}
                    </td>
                    <td className="border px-3 py-2 text-center">{count}</td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={2} className="border-b py-2 text-center">
                  No currency count available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between space-x-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <RxCross2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. If you continue, you will not be
                  able to download the bill.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onClose();
                    window.location.reload();
                  }}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="default" className="" onClick={handleDownloadPDF}>
            Download Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrintPopup;
