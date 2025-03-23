"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
// import { ShowRestaurantDetailsDialogOnOrderPage } from "@/components/orders-page-components/show-restaurant-details-dialog-component";
import { ShowCustomerDetailsDialogOnOrderPage } from "@/components/orders-page-components/show-customer-details-dialog-component";
import { ShowCancellationReasonDialog } from "@/components/orders-page-components/show-cancellation-reason-dialog-component";
import { View } from "lucide-react";

export const OrderPageColumns: ColumnDef<any>[] = [
  {
    accessorKey: "orderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Id" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.original?.orderId}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "restaurant.restaurantName",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Restaurant Name" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original?.restaurant?.restaurantName}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "user.userId",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Customer Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowCustomerDetailsDialogOnOrderPage data={row.original?.user}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowCustomerDetailsDialogOnOrderPage>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "subtotal",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">{row.getValue("subtotal")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "cancellationReason",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Cancellation Reason" />
      </div>
    ),
    cell: ({ row }) => {
      if (!row.original?.cancellationReason) {
        return <div className="flex justify-center">-</div>;
      }
      return (
        <div className="flex justify-center">
          <ShowCancellationReasonDialog data={row.original?.cancellationReason}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </ShowCancellationReasonDialog>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Date" />
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex justify-center items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
];
