"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { FaRegSadCry } from "react-icons/fa";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import ShowBankDetailsComponentDialog from "@/components/money-withdrawal-components/show-bank-details-dialog-component";
import ShowRestaurantOwnerBankDetailsDialog from "@/components/money-withdrawal-components/show-restaurant-owner-details-dialog-component";
import { RejectMoneyWithdrawalRequestCustomAlert } from "@/components/alert-components/reject-money-withdrawal-request-custom-alert";
import ShowRiderDetailsDialog from "@/components/money-withdrawal-components/show-rider-details-dialog-component";
import { View } from "lucide-react";

interface MoneyWithdrawalPageColumnProps {
  handleAccept: (queryId: string) => void;
  handleReject: ({
    withdrawId,
    rejectionReason,
  }: {
    withdrawId: string;
    rejectionReason: string;
  }) => Promise<void>;
  buttonLoadingAccept: Record<string, boolean>;
  buttonLoadingReject: Record<string, boolean>;
  userRole: string;
}

export const MoneyWithdrawalPageColumnsRestaurant = ({
  handleAccept,
  handleReject,
  buttonLoadingAccept,
  buttonLoadingReject,
  userRole,
}: MoneyWithdrawalPageColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "entityId.userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Restaurant Id" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.original?.entityId?.userId}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "entityId.restaurantName",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original?.entityId?.restaurantName}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "entityId.name",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowRestaurantOwnerBankDetailsDialog restaurantData={row.original}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowRestaurantOwnerBankDetailsDialog>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "paymentInfo.accountNumber",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Bank Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowBankDetailsComponentDialog
            name={row.original?.entityId?.restaurantName}
            bankDetails={row.original?.paymentInfo}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowBankDetailsComponentDialog>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center relative">
          <span className="absolute -top-4 -right-2 text-[9.5px] bg-yellow-500 px-2 rounded-full">
            {row.original?.status}
          </span>
          <span>{row.getValue("amount")}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Date" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {new Date(row.getValue("createdAt")).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: () => (
      <div className="flex justify-center items-center">Actions</div>
    ),
    cell: ({ row }) => {
      if (userRole === "SUPER-ADMIN") return <div>-</div>;

      const withdrawId = row.original["_id"];
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="default"
            className="w-24 h-10"
            onClick={() => handleAccept(withdrawId)}
            disabled={buttonLoadingAccept[withdrawId]}>
            {buttonLoadingAccept[withdrawId] ? (
              <ButtonLoadingAnimation text="" />
            ) : (
              <>
                <FaRegFaceSmileBeam />
                Accept
              </>
            )}
          </Button>

          <RejectMoneyWithdrawalRequestCustomAlert
            onConfirm={(rejectionReason) =>
              handleReject({ withdrawId, rejectionReason })
            }
            onCancel={() => {}}
            name={row.original["name"]}>
            <Button
              variant="destructive"
              size="default"
              className="w-24 h-10"
              disabled={buttonLoadingReject[withdrawId]}>
              {buttonLoadingReject[withdrawId] ? (
                <ButtonLoadingAnimation text="" />
              ) : (
                <>
                  <FaRegSadCry />
                  Reject
                </>
              )}
            </Button>
          </RejectMoneyWithdrawalRequestCustomAlert>
        </div>
      );
    },
    enableSorting: true,
  },
];

export const MoneyWithdrawalPageColumnsRider = ({
  handleAccept,
  handleReject,
  buttonLoadingAccept,
  buttonLoadingReject,
  userRole,
}: MoneyWithdrawalPageColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "entityId.userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rider Id" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.original?.entityId?.userId}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "entityId.name",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original?.entityId?.name}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "entityId.email",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowRiderDetailsDialog riderData={row.original}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowRiderDetailsDialog>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "paymentInfo.accountNumber",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Bank Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowBankDetailsComponentDialog
            name={row.original?.name}
            bankDetails={row.original?.paymentInfo}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowBankDetailsComponentDialog>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center relative">
          <span className="absolute -top-4 -right-2 text-[9.5px] bg-yellow-500 px-2 rounded-full">
            {row.original?.status}
          </span>
          <span>{row.getValue("amount")}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Date" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {new Date(row.getValue("createdAt")).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: () => (
      <div className="flex justify-center items-center">Actions</div>
    ),
    cell: ({ row }) => {
      if (userRole === "SUPER-ADMIN") return <div>-</div>;

      const withdrawId = row.original["_id"];
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="default"
            className="w-24 h-10"
            onClick={() => handleAccept(withdrawId)}
            disabled={buttonLoadingAccept[withdrawId]}>
            {buttonLoadingAccept[withdrawId] ? (
              <ButtonLoadingAnimation text="" />
            ) : (
              <>
                <FaRegFaceSmileBeam />
                Accept
              </>
            )}
          </Button>

          <RejectMoneyWithdrawalRequestCustomAlert
            onConfirm={(rejectionReason) =>
              handleReject({ withdrawId, rejectionReason })
            }
            onCancel={() => {}}
            name={row.original["name"]}>
            <Button
              variant="destructive"
              size="default"
              className="w-24 h-10"
              disabled={buttonLoadingReject[withdrawId]}>
              {buttonLoadingReject[withdrawId] ? (
                <ButtonLoadingAnimation text="" />
              ) : (
                <>
                  <FaRegSadCry />
                  Reject
                </>
              )}
            </Button>
          </RejectMoneyWithdrawalRequestCustomAlert>
        </div>
      );
    },
    enableSorting: true,
  },
];
