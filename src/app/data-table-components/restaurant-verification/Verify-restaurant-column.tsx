"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { FaRegSadCry } from "react-icons/fa";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { RejectAlertDialog } from "@/components/alert-components/reject-alert";
import ShowRestaurantDetailsComponentDialog from "@/components/verify-restaurant-components/show-restaurant-details-dialog-component";
import { View } from "lucide-react";

interface VerifyRestaurantPageColumnProps {
  handleAccept: (queryId: string) => void;
  handleReject: (queryId: string) => void;
  buttonLoadingAccept: Record<string, boolean>;
  buttonLoadingReject: Record<string, boolean>;
  userRole: string;
}

export const VerifyRestaurantPageColumns = ({
  handleAccept,
  handleReject,
  buttonLoadingAccept,
  buttonLoadingReject,
  userRole,
}: VerifyRestaurantPageColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.getValue("userId")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "restaurantName",
    header: ({ column }) => (
      <div className="flex justify-start items-center">
        <DataTableColumnHeader column={column} title="Restaurant Name" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-start">
          {row.getValue("restaurantName")}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "ownerDetails",
    header: ({ column }) => (
      <div className="flex items-center">
        <DataTableColumnHeader column={column} title="Owner Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start">
          <span>
            <span className="text-sm mr-1.5">Owner Name : </span>
            <span className="font-semibold">{row.original?.name}</span>
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
    accessorKey: "restaurantDetails",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Restaurant Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowRestaurantDetailsComponentDialog data={row.original}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowRestaurantDetailsComponentDialog>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Joined At" />
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

      const restaurant_id = row.original["_id"];

      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="default"
            className="w-24 h-10"
            onClick={() => handleAccept(restaurant_id)}
            disabled={buttonLoadingAccept[restaurant_id]}>
            {buttonLoadingAccept[restaurant_id] ? (
              <ButtonLoadingAnimation text="" />
            ) : (
              <>
                <FaRegFaceSmileBeam />
                Accept
              </>
            )}
          </Button>

          <RejectAlertDialog
            onConfirm={() => handleReject(restaurant_id)}
            onCancel={() => {}}
            name={row.original["name"]}>
            <Button
              variant="destructive"
              size="default"
              className="w-24 h-10"
              disabled={buttonLoadingReject[restaurant_id]}>
              {buttonLoadingReject[restaurant_id] ? (
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
