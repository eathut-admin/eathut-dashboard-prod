"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import Image from "next/image";
import { CiEdit } from "react-icons/ci";
import EditCategoryDataDialog from "@/components/categories/edit-category-dialog";
import Link from "next/link";

interface AllCategoryColumnProps {
  handleDelete: (queryId: string) => void;
  handleDeactivate: (queryId: string, status: boolean) => void;
  buttonLoadingDelete: Record<string, boolean>;
  buttonLoadingDeactivate: Record<string, boolean>;
}

export const CategoryPageColumns = ({
  handleDeactivate,
  buttonLoadingDeactivate,
}: AllCategoryColumnProps): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category Title" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-start">{row.getValue("name")}</div>
      ),
      enableSorting: true,
      enableHiding: false,
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
      filterFn: (row, id, value) => {
        const rowDate = new Date(row.getValue(id));
        const [startDate, endDate] = value;
        return rowDate >= startDate && rowDate <= endDate;
      },
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
                src={row.getValue("image") || ""}
                alt={row.getValue("name")}
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
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const data = row.original;
        const category_id = row.original["_id"];
        const status = row.original?.isActive;
        return (
          <div className="flex justify-center items-center gap-3">
            <Button
              variant={!status ? "default" : "secondary"}
              onClick={() => handleDeactivate(category_id, status)}
              className="w-28"
              disabled={buttonLoadingDeactivate[category_id]}>
              {buttonLoadingDeactivate[category_id] ? (
                <ButtonLoadingAnimation text="Loading..." />
              ) : (
                <span>
                  {status ? <span>Deactivate</span> : <span>Activate</span>}
                </span>
              )}
            </Button>

            <EditCategoryDataDialog categoryData={data ? data : []}>
              <Button variant="default">
                <CiEdit />
              </Button>
            </EditCategoryDataDialog>
          </div>
        );
      },
    },
  ];
};
