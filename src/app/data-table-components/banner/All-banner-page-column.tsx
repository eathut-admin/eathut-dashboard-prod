"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { DeleteAlertDialog } from "@/components/alert-components/delete-alert";
import { BsTrash } from "react-icons/bs";
import Image from "next/image";
import { CiEdit } from "react-icons/ci";
import UpdateBannerDetailsDialogComponent from "@/components/banner-components/update-banner-details-dialog-component";
import Link from "next/link";

interface AllAdminColumnProps {
  handleDelete: (queryId: string) => void;
  handleDeactivate: (queryId: string, status: boolean) => void;
  buttonLoadingDelete: Record<string, boolean>;
  buttonLoadingDeactivate: Record<string, boolean>;
}

export const AllBannerPageColumns = ({
  handleDelete,
  handleDeactivate,
  buttonLoadingDelete,
  buttonLoadingDeactivate,
}: AllAdminColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "bannerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banner Id" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">{row.getValue("bannerId")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Title" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <span className="capitalize">{row.getValue("title")}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Description" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <span className="capitalize">{row.getValue("description")}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "image",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Image" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <Link
            href={row.getValue("image")}
            target="_blank"
            title="Click to view">
            <Image
              src={row.getValue("image")}
              alt={row.getValue("title")}
              width={100}
              height={100}
              className="rounded h-[60px] w-[120px] aspect-video object-cover object-center"></Image>
          </Link>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "addedOn",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Status" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1.5 justify-center items-center relative">
          <span
            className={`${
              row.original?.isActive ? "bg-green-500" : "bg-red-500"
            } text-black rounded-full inline-block text-xs h-3 w-3 absolute -top-6 -right-1.5 cursor-pointer`}
            title={row.original?.isActive ? "Active" : "Inactive"}></span>
          <span className="capitalize">
            {new Date(row.getValue("addedOn")).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
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
      const banner_id = row.original["_id"];
      const status = row.original?.isActive;
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant={!status ? "default" : "secondary"}
            onClick={() => handleDeactivate(banner_id, status)}
            className="w-28"
            disabled={buttonLoadingDeactivate[banner_id]}>
            {buttonLoadingDeactivate[banner_id] ? (
              <ButtonLoadingAnimation text="Loading..." />
            ) : (
              <span>
                {status ? <span>Deactivate</span> : <span>Activate</span>}
              </span>
            )}
          </Button>
          <UpdateBannerDetailsDialogComponent
            bannerId={banner_id}
            title={row.original["title"]}
            description={row.original["description"]}>
            <Button size="icon" variant="default">
              <CiEdit />
            </Button>
          </UpdateBannerDetailsDialogComponent>
          <DeleteAlertDialog
            onConfirm={() => handleDelete(banner_id)}
            onCancel={() => {}}
            name={row.original["name"]}>
            <Button
              variant="destructive"
              className="h-10"
              disabled={buttonLoadingDelete[banner_id]}>
              {buttonLoadingDelete[banner_id] ? (
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
