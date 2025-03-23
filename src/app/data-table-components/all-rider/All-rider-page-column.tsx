"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import ShowRiderBankDetailsComponentDialog from "@/components/all-rider-components/show-rider-bank-details-dialog-component";
import { Button } from "@/components/ui/button";
import ShowRiderGeneralDetailsComponentDialog from "@/components/all-rider-components/show-rider-general-details-dialog-component";
import Image from "next/image";
import Link from "next/link";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import RiderAllDeliveredOrdersSheetComponent from "@/components/all-rider-components/show-all-delivered-orders-of-rider-sheet-component";
import RiderCashWithdrawalSheetComponent from "@/components/all-rider-components/rider-cash-withdrawal-sheet-component";
import RiderReviewSheetComponent from "@/components/all-rider-components/rider-review-sheet-component";
import { View } from "lucide-react";

interface AllRiderColumnProps {
  handleBlock: (queryId: string) => void;
  buttonLoadingBlock: Record<string, boolean>;
}

export const AllRiderPageColumns = ({
  handleBlock,
  buttonLoadingBlock,
}: AllRiderColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Rider Id" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">{row.getValue("userId")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start gap-2.5 items-center ">
        <div>
          <Link href={row.original?.profileImage} target="_blank">
            <Image
              src={row.original?.profileImage}
              alt={row.getValue("name")}
              width={100}
              height={100}
              className="rounded-full object-cover object-center h-[50px] w-[50px]"></Image>
          </Link>
        </div>
        <div className="ml-2 flex flex-col items-start">
          <span className="font-semibold">{row.getValue("name")}</span>
          <div className="flex items-center gap-2 text-xs mt-1">
            <p className="text-gray-500">Total Income :</p>
            <p className="font-semibold">{row.original?.totalIncome}/-</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <p className="text-gray-500">Total Delivered Orders :</p>
            <p className="font-semibold">
              {row.original?.totalDeliveredOrders}
            </p>
          </div>
        </div>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <ShowRiderGeneralDetailsComponentDialog
            riderName={row.original?.name}
            generalDetails={row.original}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowRiderGeneralDetailsComponentDialog>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "lastActiveDate",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Last Active Date" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        {new Date(row.getValue("lastActiveDate")).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,

    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    accessorKey: "deliveredOrders",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Delivered Orders" />
      </div>
    ),
    cell: ({ row }) => {
      if (row.original?.totalDeliveredOrders === 0) return <div>-</div>;
      return (
        <div className="flex justify-center items-center">
          <RiderAllDeliveredOrdersSheetComponent
            riderName={row.original?.name}
            deliveredOrdersDetails={row.original?.deliveredOrders}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </RiderAllDeliveredOrdersSheetComponent>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "reviews",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Reviews" />
      </div>
    ),
    cell: ({ row }) => {
      if (row.original?.totalRatings <= 0) return <div>-</div>;
      return (
        <div>
          <RiderReviewSheetComponent
            riderId={row.original?._id || ""}
            riderName={row.original?.name || ""}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </RiderReviewSheetComponent>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "paymentInfo.accountNumber",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Bank Details" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <ShowRiderBankDetailsComponentDialog
          riderName={row.original?.name}
          bankDetails={row.original?.paymentInfo}>
          <Button variant="outline" size="icon" className="h-10 text-sm">
            <View />
          </Button>
        </ShowRiderBankDetailsComponentDialog>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "paymentInfo",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Withdrawal History" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <RiderCashWithdrawalSheetComponent
          riderName={row.original?.name || ""}
          riderEmail={row.original?.email || ""}
          riderPhone={row.original?.phone || ""}
          riderId={row.original?._id || ""}>
          <Button variant="outline" size="icon" className="h-10 text-sm">
            <View />
          </Button>
        </RiderCashWithdrawalSheetComponent>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const riderId = row.original["_id"];
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant={
              row.original["availability"] === "SUSPENDED"
                ? "secondary"
                : "default"
            }
            onClick={() => handleBlock(riderId)}
            className="h-10"
            disabled={buttonLoadingBlock[riderId]}>
            {buttonLoadingBlock[riderId] ? (
              <ButtonLoadingAnimation text="" />
            ) : (
              <span>
                {row.original["availability"] === "SUSPENDED" ? (
                  <span>Unblock</span>
                ) : (
                  <span>Block</span>
                )}
              </span>
            )}
          </Button>
        </div>
      );
    },
  },
];
