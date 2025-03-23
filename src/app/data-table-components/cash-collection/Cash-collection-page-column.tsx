"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import ShowRiderBankDetailsComponentDialog from "@/components/all-rider-components/show-rider-bank-details-dialog-component";
import { Button } from "@/components/ui/button";
import { RiFileCopyLine } from "react-icons/ri";
import { toast } from "sonner";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { View } from "lucide-react";

interface AllRiderCollectCashColumnProps {
  handleCollect: (queryId: string) => void;
  buttonLoadingCollect: Record<string, boolean>;
  userRole: string;
}

export const CashCollectionPageColumns = ({
  handleCollect,
  buttonLoadingCollect,
  userRole,
}: AllRiderCollectCashColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rider Id" />
    ),
    cell: ({ row }) => {
      const riderId = row.getValue("userId") as string;

      const handleCopyRiderId = () => {
        navigator.clipboard.writeText(riderId).then(() => {
          toast.success("Rider ID copied to clipboard!");
        });
      };

      return (
        <div className="flex justify-between items-center gap-2">
          {riderId}
          <Button
            variant="secondary"
            size="icon"
            onClick={handleCopyRiderId}
            className="h-8 w-8">
            <RiFileCopyLine className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.getValue("name")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "bankDetails",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Bank Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <ShowRiderBankDetailsComponentDialog
          riderName={row.original?.name}
          bankDetails={row.original?.paymentInfo}>
          <Button variant="outline" size="icon" className="h-10 text-sm">
            <View />
          </Button>
        </ShowRiderBankDetailsComponentDialog>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "totalDeliveredOrders",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Delivery Count" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("totalDeliveredOrders")}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "orderWalletBalance",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Cash Need To Collect" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("orderWalletBalance")}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      if (userRole === "SUPER-ADMIN") return <div>-</div>;

      const deliveryPartnerId = row.original["_id"];
      const orderWalletBalance = row.original["orderWalletBalance"];
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant={orderWalletBalance === 0 ? "secondary" : "default"}
            onClick={() => handleCollect(deliveryPartnerId)}
            className="h-10"
            disabled={
              buttonLoadingCollect[deliveryPartnerId] ||
              orderWalletBalance === 0
            }>
            {buttonLoadingCollect[deliveryPartnerId] ? (
              <ButtonLoadingAnimation text="" />
            ) : (
              <span>
                {orderWalletBalance === 0 ? (
                  <span>Already Collected</span>
                ) : (
                  <span>Collect Cash</span>
                )}
              </span>
            )}
          </Button>
        </div>
      );
    },
  },
];
