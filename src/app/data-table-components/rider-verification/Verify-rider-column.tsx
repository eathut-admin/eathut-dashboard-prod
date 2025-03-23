"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { FaRegSadCry } from "react-icons/fa";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { RejectAlertDialog } from "@/components/alert-components/reject-alert";
import { ShowBankDetailsDialog } from "@/components/unverified-rider-restaurant-common-components/show-bank-details-dialog-component";
import { ShowAllDetailsDialog } from "@/components/unverified-rider-restaurant-common-components/all-details-dialog-component";
import { View } from "lucide-react";

interface VerifyRiderPageColumnProps {
  handleAccept: (queryId: string) => void;
  handleReject: (queryId: string) => void;
  buttonLoadingAccept: Record<string, boolean>;
  buttonLoadingReject: Record<string, boolean>;
  userRole: string;
}

export const VerifyRiderPageColumns = ({
  handleAccept,
  handleReject,
  buttonLoadingAccept,
  buttonLoadingReject,
  userRole,
}: VerifyRiderPageColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rider Id" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.getValue("userId")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    cell: ({ row }) => {
      return <div className="flex justify-center">{row.getValue("name")}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "allDetails",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowAllDetailsDialog
            generalDetails={row.original}
            riderName={row.original?.name}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowAllDetailsDialog>
        </div>
      );
    },
    enableSorting: true,
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
        <div className="flex justify-center">
          <ShowBankDetailsDialog
            bankDetails={row.original?.paymentInfo}
            riderName={row.original?.name}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowBankDetailsDialog>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Date" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {new Date(row.original["joinedAt"]).toLocaleDateString("gb-IN", {
            day: "numeric",
            month: "long",
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

      const rider_id = row.original["_id"];
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="default"
            className="w-24 h-10"
            onClick={() => handleAccept(rider_id)}
            disabled={buttonLoadingAccept[rider_id]}>
            {buttonLoadingAccept[rider_id] ? (
              <ButtonLoadingAnimation text="" />
            ) : (
              <>
                <FaRegFaceSmileBeam />
                Accept
              </>
            )}
          </Button>

          <RejectAlertDialog
            onConfirm={() => handleReject(rider_id)}
            onCancel={() => {}}
            name={row.original["name"]}>
            <Button
              variant="destructive"
              size="default"
              className="w-24 h-10"
              disabled={buttonLoadingReject[rider_id]}>
              {buttonLoadingReject[rider_id] ? (
                <ButtonLoadingAnimation text="" />
              ) : (
                <>
                  <FaRegSadCry />
                  Reject
                </>
              )}
            </Button>
          </RejectAlertDialog>
        </div>
      );
    },
    enableSorting: true,
  },
];
