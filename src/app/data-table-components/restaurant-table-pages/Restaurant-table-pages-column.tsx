"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import { View } from "lucide-react";
import ShowCustomerAddressComponentDialogOfRestaurantTablePage from "@/components/restaurant-table-page-components/show-customer-details-dialog-component";
import ShowOrderSummeryComponentDialogOfRestaurantTablePage from "@/components/restaurant-table-page-components/show-order-summery-dialog-component";
import ShowOrderAmountComponentDialogOfRestaurantTablePage from "@/components/restaurant-table-page-components/show-amount-details-dialog-component";

export const RestaurantTablePagesColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "orderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Id" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-start">{row.getValue("orderId")}</div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "deliveryAddress",
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <DataTableColumnHeader column={column} title="Customer Details" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <ShowCustomerAddressComponentDialogOfRestaurantTablePage
            addressData={row.original?.deliveryAddress || []}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowCustomerAddressComponentDialogOfRestaurantTablePage>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "orderSummery",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Order Summery" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowOrderSummeryComponentDialogOfRestaurantTablePage
            data={row.original}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowOrderSummeryComponentDialogOfRestaurantTablePage>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <ShowOrderAmountComponentDialogOfRestaurantTablePage
            data={row.original}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowOrderAmountComponentDialogOfRestaurantTablePage>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Status" />
      </div>
    ),
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex justify-center">
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              order.orderStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : order.orderStatus === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : order.orderStatus === "PREPARING"
                ? "bg-blue-100 text-blue-800"
                : order.orderStatus === "REJECTED"
                ? "bg-purple-100 text-purple-800"
                : order.orderStatus === "OUT-FOR-DELIVERY"
                ? "bg-indigo-100 text-indigo-800"
                : order.orderStatus === "DELIVERED"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}>
            {order.orderStatus}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Order Date" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {new Date(row.original["createdAt"]).toLocaleDateString("gb-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      );
    },
    enableSorting: true,
  },
];
