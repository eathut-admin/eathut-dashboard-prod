"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { BsTrash } from "react-icons/bs";
import { DeleteAlertDialog } from "@/components/alert-components/delete-alert";
import { ShowCouponDetailsDialog } from "@/components/coupon-page-components/show-coupon-details-dialog-component";
import { toast } from "sonner";
import { View } from "lucide-react";

interface AllUserColumnProps {
  handleDelete: (queryId: string) => void;
  handleDeactivate: (queryId: string, status: boolean) => void;
  buttonLoadingDelete: Record<string, boolean>;
  buttonLoadingDeactivate: Record<string, boolean>;
  userRole: string;
}

export const CouponPageColumns = ({
  handleDelete,
  handleDeactivate,
  buttonLoadingDelete,
  buttonLoadingDeactivate,
  userRole,
}: AllUserColumnProps): ColumnDef<any>[] => {
  return [
    {
      id: "serial_number",
      accessorKey: "serial_number",
      header: () => <span>##</span>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <span>0{row.index + 1}</span>{" "}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Coupon Code" />
      ),
      cell: ({ row }) => {
        const code = row.getValue("code") as string;
        const handleCopy = () => {
          navigator.clipboard.writeText(code || "").then(() => {
            toast.success("Coupon code copied to clipboard!");
          });
        };

        return (
          <div className="flex justify-between items-center gap-2">
            <span>{code}</span>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="px-2 rounded h-fit py-1.5"
              title="Copy code">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </Button>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "addedOn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col items-start">
            <span>
              Add Date :{" "}
              <span className="font-semibold">
                {new Date(row.getValue("addedOn")).toLocaleTimeString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </span>
            <span>
              Exp Date :{" "}
              <span className="font-semibold">
                {new Date(row.original.expiryDate).toLocaleTimeString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>
        );
      },
      enableSorting: true,
      filterFn: (row, _id, value) => {
        const rowDate = new Date(row.getValue(_id));
        const [startDate, endDate] = value;
        return rowDate >= startDate && rowDate <= endDate;
      },
    },
    {
      accessorKey: "used",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <DataTableColumnHeader column={column} title="Used / Max Use" />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <span className="capitalize">
              {`${row.original.usedCount || 0} / ${
                row.original.usageLimit || 0
              }`}
            </span>
          </div>
        );
      },
      enableSorting: false,
      filterFn: (row, id, value) => {
        const rowDate = new Date(row.getValue(id));
        const [startDate, endDate] = value;
        return rowDate >= startDate && rowDate <= endDate;
      },
    },
    {
      accessorKey: "exp_date",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <DataTableColumnHeader column={column} title="Details" />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <ShowCouponDetailsDialog couponDetails={row.original}>
              <Button variant="outline" size="icon">
                <View />
              </Button>
            </ShowCouponDetailsDialog>
          </div>
        );
      },
      enableSorting: false,
      filterFn: (row, id, value) => {
        const rowDate = new Date(row.getValue(id));
        const [startDate, endDate] = value;
        return rowDate >= startDate && rowDate <= endDate;
      },
    },
    // {
    //   accessorKey: "time",
    //   header: ({ column }) => (
    //     <div className="flex justify-center items-center">
    //       <DataTableColumnHeader column={column} title="Time" />
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex justify-center items-center">
    //         <span className="capitalize">{row.getValue("time")}</span>
    //       </div>
    //     );
    //   },
    //   enableSorting: true,
    //   filterFn: (row, id, value) => {
    //     const rowDate = new Date(row.getValue(id));
    //     const [startDate, endDate] = value;
    //     return rowDate >= startDate && rowDate <= endDate;
    //   },
    // },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const couponId = row.original["_id"];
        const status = row.original.isActive;
        return (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant={!status ? "default" : "secondary"}
              onClick={() => handleDeactivate(couponId, status)}
              className="w-28"
              disabled={buttonLoadingDeactivate[couponId]}>
              {buttonLoadingDeactivate[couponId] ? (
                <ButtonLoadingAnimation text="Loading..." />
              ) : (
                <span>
                  {status ? <span>Deactivate</span> : <span>Activate</span>}
                </span>
              )}
            </Button>
            {userRole === "SUPER-ADMIN" && (
              <DeleteAlertDialog
                onConfirm={() => handleDelete(couponId)}
                onCancel={() => {}}
                name={row.original["code"]}>
                <Button
                  variant="destructive"
                  className="h-10"
                  disabled={buttonLoadingDelete[couponId]}>
                  {buttonLoadingDelete[couponId] ? (
                    <ButtonLoadingAnimation text="" />
                  ) : (
                    <BsTrash />
                  )}
                </Button>
              </DeleteAlertDialog>
            )}
          </div>
        );
      },
    },
  ];
};
