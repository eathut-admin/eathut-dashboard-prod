"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { DeleteAlertDialog } from "@/components/alert-components/delete-alert";
import { BsTrash } from "react-icons/bs";
import ShowAdminDetailsDialog from "@/components/admin/show-admin-details-dialog-component";
import AdminCashDepositHistorySheetComponent from "@/components/admin/admin-cash-deposit-history-sheet-component";
import { View } from "lucide-react";

interface AllAdminColumnProps {
  handleDelete: (queryId: string) => void;
  // handleBlock: (queryId: string) => void;
  buttonLoadingDelete: Record<string, boolean>;
  // buttonLoadingBlock: Record<string, boolean>;
}

export const AllAdminPageColumns = ({
  handleDelete,
  // handleBlock,
  buttonLoadingDelete,
}: // buttonLoadingBlock,
AllAdminColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Admin Id" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">{row.getValue("userId")}</div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Admin Name" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.getValue("name")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowAdminDetailsDialog data={row.original}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowAdminDetailsDialog>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "collectedAmount",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Collected Amount" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <span className="capitalize">{row.getValue("collectedAmount")}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "withdrawalHistory",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Withdrawal History" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <AdminCashDepositHistorySheetComponent
            adminName={row.original?.name}
            adminPhone={row.original?.phone}
            adminAddress={row.original?.address}
            adminEmail={row.original?.email}
            adminId={row.original?._id}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </AdminCashDepositHistorySheetComponent>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "actions",
    header: () => (
      <div className="flex justify-center items-center">Actions</div>
    ),
    cell: ({ row }) => {
      const adminId = row.original["_id"];
      return (
        <div className="flex justify-center items-center gap-3">
          {/* <Button
            variant={!row.original["is_blocked"] ? "default" : "secondary"}
            onClick={() => handleBlock(row.original["adminId"])}
            className="h-10 w-28"
            disabled={buttonLoadingBlock[adminId]}>
            {buttonLoadingBlock[adminId] ? (
              <ButtonLoadingAnimation text="Blocking" />
            ) : (
              <span>
                {row.original["is_blocked"] ? (
                  <span>Unblock</span>
                ) : (
                  <span>Block</span>
                )}
              </span>
            )}
          </Button> */}
          <DeleteAlertDialog
            onConfirm={() => handleDelete(adminId)}
            onCancel={() => {}}
            name={row.original["name"]}>
            <Button
              variant="destructive"
              className="h-10"
              disabled={buttonLoadingDelete[adminId]}>
              {buttonLoadingDelete[adminId] ? (
                <ButtonLoadingAnimation text="" />
              ) : (
                <BsTrash />
              )}
            </Button>
          </DeleteAlertDialog>
        </div>
      );
    },
    enableSorting: true,
  },
];
