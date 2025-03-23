"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { LuTrash2 } from "react-icons/lu";
import RestaurantReviewSheetComponent from "@/components/restaurant-panel-components/restaurant-review-sheet-component";
import RestaurantSalesDrawerComponent from "@/components/restaurant-panel-components/restaurant-sales-drawer-component";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
// import { DeleteAlertDialog } from "@/components/alert-components/delete-alert";
import { RestaurantInformationWithOwnerDetailsDialog } from "@/components/restaurant-panel-components/show-restaurant-details-with-owner-information-dialog-component";
import { View } from "lucide-react";

interface AllRestaurantColumnProps {
  // handleDelete: (queryId: string) => void;
  handleBlock: (queryId: string) => void;
  // buttonLoadingDelete: Record<string, boolean>;
  buttonLoadingBlock: Record<string, boolean>;
}

export const RestaurantPanelColumns = ({
  // handleDelete,
  handleBlock,
  // buttonLoadingDelete,
  buttonLoadingBlock,
}: AllRestaurantColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "restaurantId",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Id" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <span>{row.getValue("restaurantId")}</span>{" "}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "restaurantName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Restaurant Name" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.getValue("restaurantName")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Items" />
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <Link
          href={`/restaurant-table-pages/${row.original?.docId}/restaurant-all-items`}>
          <Button variant="outline" size="icon" className="h-10 text-sm">
            <View />
          </Button>
        </Link>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderDetails",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Order Details" />
      </div>
    ),
    cell: ({ row }) => {
      const _id = row.original?.docId;
      return (
        <div>
          <section className="flex flex-col justify-start space-y-2">
            <Link
              href={`/restaurant-table-pages/${_id}/restaurant-total-order-details`}
              className="space-x-4">
              <Button className="min-w-44 h-10 bg-green-500 hover:bg-green-600 text-[#fff]">
                <span className="flex justify-between min-w-full">
                  <span>Total Orders</span>
                  <span>
                    <IoIosArrowRoundForward />
                  </span>
                  {row.original.orderDetails?.totalOrders}
                </span>
              </Button>
            </Link>
            <Link
              href={`/restaurant-table-pages/${_id}/restaurant-delivered-order-details`}
              className="space-x-4">
              <Button className="min-w-44 h-10 bg-green-500 hover:bg-green-600 text-[#fff]">
                <span className="flex justify-between min-w-full">
                  <span>Delivered Orders</span>
                  <span>
                    <IoIosArrowRoundForward />
                  </span>
                  {row.original.orderDetails?.deliveredOrders}
                </span>
              </Button>
            </Link>

            <Link
              href={`/restaurant-table-pages/${_id}/restaurant-cancelled-order-details`}
              className="space-x-4">
              <Button className="min-w-44 h-10 bg-green-500 hover:bg-green-600 text-[#fff]">
                <span className="flex justify-between min-w-full">
                  <span>Cancelled Orders</span>
                  <span>
                    <IoIosArrowRoundForward />
                  </span>
                  {row.original.orderDetails?.canceledOrders}
                </span>
              </Button>
            </Link>
          </section>
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "reviews",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Reviews" />
      </div>
    ),
    cell: ({ row }) => {
      if (row.original?.totalRating <= 0) return <div>-</div>;
      return (
        <div>
          <RestaurantReviewSheetComponent
            restaurant_id={row.original?.docId || ""}
            restaurant_name={row.original?.restaurantName || ""}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </RestaurantReviewSheetComponent>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "information",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Information" />
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <RestaurantInformationWithOwnerDetailsDialog data={row.original || []}>
          <Button variant="outline" size="icon" className="h-10 text-sm">
            <View />
          </Button>
        </RestaurantInformationWithOwnerDetailsDialog>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sales",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Sales" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div>
          <RestaurantSalesDrawerComponent
            ownerName={row.original?.ownerDetails?.name || ""}
            ownerEmail={row.original?.ownerDetails?.email || ""}
            restaurantId={row.original?.docId || ""}
            restaurantName={row.original?.restaurantName || ""}
            totalOrders={row.original.orderDetails?.totalOrders || 0}
            cancelledOrders={row.original.orderDetails?.canceledOrders || 0}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </RestaurantSalesDrawerComponent>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const docId = row.original["docId"];
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant={!row.original["suspended"] ? "default" : "secondary"}
            onClick={() => handleBlock(row.original["docId"])}
            className="h-10 w-28"
            disabled={buttonLoadingBlock[docId]}>
            {buttonLoadingBlock[docId] ? (
              <ButtonLoadingAnimation text="Blocking" />
            ) : (
              <span>
                {row.original["suspended"] ? (
                  <span>Unblock</span>
                ) : (
                  <span>Block</span>
                )}
              </span>
            )}
          </Button>
          {/* <DeleteAlertDialog
            onConfirm={() => handleDelete(restaurantId)}
            onCancel={() => {}}
            name={row.original["restaurantName"]}>
            <Button
              variant="destructive"
              className="h-10"
              disabled={buttonLoadingDelete[restaurantId]}>
              {buttonLoadingDelete[restaurantId] ? (
                <ButtonLoadingAnimation text="" />
              ) : (
                <LuTrash2 />
              )}
            </Button>
          </DeleteAlertDialog> */}
        </div>
      );
    },
  },
];
