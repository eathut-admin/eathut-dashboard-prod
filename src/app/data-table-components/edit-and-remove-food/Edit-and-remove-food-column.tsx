"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { BsTrash } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { DeleteAlertDialog } from "@/components/alert-components/delete-alert";
import UpdateFoodDetailsFormSheetComponent from "@/components/edit-remove-food-components/edit-food-sheet-component";
import { ShowFoodDescriptionDialog } from "@/components/edit-remove-food-components/show-food-description-dialog-component";
import Image from "next/image";
import Link from "next/link";
import { ShowFoodPriceDialog } from "@/components/edit-remove-food-components/show-food-price-dialog-component";
import { View } from "lucide-react";

interface EditAndRemoveFoodColumnProps {
  handleDelete: (queryId: string) => void;
  buttonLoadingDelete: Record<string, boolean>;
}

export const EditAndRemoveFoodPageColumns = ({
  handleDelete,
  buttonLoadingDelete,
}: EditAndRemoveFoodColumnProps): ColumnDef<any>[] => [
  {
    id: "serial_number",
    accessorKey: "serial_number",
    header: () => <span>##</span>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <span>{row.index + 1}</span>{" "}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Food Name" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-start">
        <span>
          Food Name :{" "}
          <span className="font-semibold">{row.getValue("name")}</span>
        </span>
        <span>Category : {row.original.category.name || ""}</span>
        <span>{row.original.vegOrNonVeg.toLowerCase()}</span>
      </div>
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
          <ShowFoodDescriptionDialog
            description={row.getValue("description") || "Not found"}
            foodName={row.getValue("name") || "not found"}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowFoodDescriptionDialog>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Price" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <ShowFoodPriceDialog
            price={row.original.price || []}
            foodName={row.getValue("name") || "not found"}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowFoodPriceDialog>
        </div>
      );
    },
    enableSorting: false,
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
    accessorKey: "overallRating",
    header: ({ column }) => (
      <div className="flex justify-start items-center">
        <DataTableColumnHeader column={column} title="Price" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start">
          <span>
            Over All Rating :{" "}
            <span className="font-semibold">
              {row.getValue("overallRating") || "0"}
            </span>
          </span>
          <span>
            Total Ratings :{" "}
            <span className="font-semibold">
              {row.original?.totalRatings || "0"}
            </span>
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
      const all_details = row.original;
      const foodId = row.original["_id"];
      return (
        <div className="flex justify-center items-center gap-3">
          <UpdateFoodDetailsFormSheetComponent data={all_details || []}>
            <Button size="icon">
              <CiEdit />
            </Button>
          </UpdateFoodDetailsFormSheetComponent>
          <DeleteAlertDialog
            onConfirm={() => handleDelete(foodId)}
            onCancel={() => {}}
            name={row.original["name"]}>
            <Button
              variant="destructive"
              size="icon"
              className="h-10"
              disabled={buttonLoadingDelete[foodId]}>
              {buttonLoadingDelete[foodId] ? (
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
