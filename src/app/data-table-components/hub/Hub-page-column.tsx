"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { BsTrash } from "react-icons/bs";
import { HubDeleteAlertDialog } from "@/components/alert-components/hub-delete-custom-alert";

interface AllHubColumnProps {
  handleDelete: (queryId: string) => void;
  buttonLoadingDelete: Record<string, boolean>;
}

export const AllHubPageColumns = ({
  handleDelete,
  buttonLoadingDelete,
}: AllHubColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Hub Id" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">{row.getValue("userId")}</div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hub Name" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.getValue("city")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex items-center">
        <DataTableColumnHeader column={column} title="Admin Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start">
          <span>
            <span className="text-sm mr-1.5">Admin Name : </span>
            <span className="font-semibold">{row.getValue("name")}</span>
          </span>
          <span>
            <span className="text-sm mr-1.5">Phone : </span>
            <span className="font-semibold">{row.original?.phone}</span>
          </span>
          <span>
            <span className="text-sm mr-1.5">Email : </span>
            <span className="font-semibold">{row.original?.email}</span>
          </span>
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
      const hub_id = row.original["_id"];
      return (
        <div className="flex justify-center items-center gap-3">
          <HubDeleteAlertDialog
            onConfirm={() => handleDelete(hub_id)}
            onCancel={() => {}}
            name={row.original["city"]}>
            <Button
              variant="destructive"
              className="h-10"
              disabled={buttonLoadingDelete[hub_id]}>
              {buttonLoadingDelete[hub_id] ? (
                <ButtonLoadingAnimation text="" />
              ) : (
                <BsTrash />
              )}
            </Button>
          </HubDeleteAlertDialog>
        </div>
      );
    },
    enableSorting: true,
  },
];
