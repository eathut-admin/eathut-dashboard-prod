"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import CustomerUsedCouponSheetComponent from "@/components/customer-panel-components/customer-used-coupon-sheet-component";
import ShowCustomerOrdersComponentDialog from "@/components/customer-panel-components/show-customer-orders-dialog-component";
import Image from "next/image";
import Link from "next/link";
import CustomerUsedOfferSheetComponent from "@/components/customer-panel-components/customer-used-offer-sheet-component";
import { View } from "lucide-react";
// import ShowCustomerAddressComponentDialog from "@/components/customer-panel-components/show-customer-address-component-dialog";

interface AllUserColumnProps {
  // handleDelete: (queryId: string) => void;
  handleBlock: (queryId: string) => void;
  // buttonLoadingDelete: Record<string, boolean>;
  buttonLoadingBlock: Record<string, boolean>;
}

export const AllCustomerPageColumns = ({
  handleBlock,
  buttonLoadingBlock,
}: AllUserColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Customer Id" />
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
      <div className="flex justify-start gap-2.5 items-center relative">
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
          <span>{row.original?.email}</span>
          <span className="absolute -top-1.5 text-[10px] font-semibold right-0 border rounded-full px-2">
            {new Date(row.original?.joinedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "totalOrders",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Order Details" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <ShowCustomerOrdersComponentDialog
          customerName={row.original?.name}
          totalOrders={row.getValue("totalOrders")}
          deliveredOrders={row.original?.totalDeliveredOrders}
          cancelledOrders={row.original?.totalCancelledOrders}>
          <Button variant="outline" size="icon" className="h-10 text-sm">
            <View />
          </Button>
        </ShowCustomerOrdersComponentDialog>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "address",
  //   header: ({ column }) => (
  //     <div className="flex justify-center items-center">
  //       <DataTableColumnHeader column={column} title="Address" />
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     if (!row.original?.address) {
  //       return <div className="flex justify-center items-center">-</div>;
  //     }

  //     return (
  //       <div className="flex justify-center items-center">
  //         <ShowCustomerAddressComponentDialog
  //           customerName={row.original?.name}
  //           addressData={row.original?.address}>
  //           <Button variant="outline" className="h-10 text-sm">
  //             <View />
  //             view
  //           </Button>
  //         </ShowCustomerAddressComponentDialog>
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "totalDeliveredOrderAmount",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("totalDeliveredOrderAmount")}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "lastOrderDate",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Last Order" />
      </div>
    ),
    cell: ({ row }) => {
      const lastOrderDateString = row.getValue("lastOrderDate") as string;
      const lastOrderDate = new Date(lastOrderDateString);
      return (
        <div className="flex justify-center">
          {lastOrderDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,

    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    accessorKey: "coupon",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Coupon" />
      </div>
    ),
    cell: ({ row }) => {
      if (!row.original?.usedCouponDetails)
        return <div className="flex justify-center items-center">-</div>;
      return (
        <div className="flex justify-center">
          <CustomerUsedCouponSheetComponent
            customerName={row.original?.name}
            couponData={row.original?.usedCouponDetails}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </CustomerUsedCouponSheetComponent>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "offer",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Offer" />
      </div>
    ),

    cell: ({ row }) => {
      if (!row.original?.usedOfferDetails)
        return <div className="flex justify-center items-center">-</div>;
      return (
        <div className="flex justify-center">
          <CustomerUsedOfferSheetComponent
            customerName={row.original?.name}
            offerData={row.original?.usedOfferDetails}>
            <Button variant="outline" size="icon" className="h-10 text-sm">
              <View />
            </Button>
          </CustomerUsedOfferSheetComponent>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const customerId = row.original["_id"];
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant={!row.original["blocked"] ? "default" : "secondary"}
            onClick={() => handleBlock(customerId)}
            className="h-10"
            disabled={buttonLoadingBlock[customerId]}>
            {buttonLoadingBlock[customerId] ? (
              <ButtonLoadingAnimation text="" />
            ) : (
              <span>
                {row.original["blocked"] ? (
                  <span>Unblock</span>
                ) : (
                  <span>Block</span>
                )}
              </span>
            )}
          </Button>
          {/* <DeleteAlertDialog
            onConfirm={() => handleDelete(customerId)}
            onCancel={() => {}}
            name={row.original["name"]}>
            <Button
              variant="destructive"
              className="w-10 h-10"
              disabled={buttonLoadingDelete[customerId]}>
              {buttonLoadingDelete[customerId] ? (
                <ButtonLoadingAnimation text="" />
              ) : (
                <BsTrash />
              )}
            </Button>
          </DeleteAlertDialog> */}
        </div>
      );
    },
  },
];
