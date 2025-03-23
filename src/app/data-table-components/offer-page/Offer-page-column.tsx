"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Button } from "@/components/ui/button";
import ButtonLoadingAnimation from "@/components/loading-animations/Button-animation";
import { BsTrash } from "react-icons/bs";
import { DeleteAlertDialog } from "@/components/alert-components/delete-alert";
import ShowOfferDescriptionComponentDialog from "@/components/offer-page-components/show-offer-description-dialog-component";
import ShowOfferDetailsComponentDialog from "@/components/offer-page-components/show-offer-details-dialog-component";
import { CiEdit } from "react-icons/ci";
import UpdateOfferDetailsSheetComponent from "@/components/offer-page-components/update-offer-details-sheet-component";
import { View } from "lucide-react";

interface AllUserColumnProps {
  handleDelete: (queryId: string) => void;
  buttonLoadingDelete: Record<string, boolean>;
  userRole: string;
}

export const OfferPageColumns = ({
  handleDelete,
  buttonLoadingDelete,
  userRole,
}: AllUserColumnProps): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "offerId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Offer Id" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-start">{row.getValue("offerId")}</div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-start">{row.getValue("title")}</div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <div className="flex justify-center">
          <DataTableColumnHeader column={column} title="Description" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ShowOfferDescriptionComponentDialog
            offer_id={row.original.offerId || "00000"}
            description={row.getValue("description") || "not found"}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowOfferDescriptionComponentDialog>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "details",
      header: ({ column }) => (
        <div className="flex justify-center">
          <DataTableColumnHeader column={column} title="Details" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ShowOfferDetailsComponentDialog data={row.original}>
            <Button variant="outline" size="icon">
              <View />
            </Button>
          </ShowOfferDetailsComponentDialog>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const offerId = row.original["offerDocId"];
        const data = row.original;
        return (
          <div className="flex justify-center items-center gap-2">
            {userRole === "SUPER-ADMIN" && (
              <UpdateOfferDetailsSheetComponent offerData={data ? data : []}>
                <Button variant="default" size="icon">
                  <CiEdit />
                </Button>
              </UpdateOfferDetailsSheetComponent>
            )}

            <DeleteAlertDialog
              onConfirm={() => handleDelete(offerId)}
              onCancel={() => {}}
              name={row.original["offerId"]}>
              <Button
                variant="destructive"
                className="h-10"
                disabled={buttonLoadingDelete[offerId]}>
                {buttonLoadingDelete[offerId] ? (
                  <ButtonLoadingAnimation text="" />
                ) : (
                  <BsTrash />
                )}
              </Button>
            </DeleteAlertDialog>
          </div>
        );
      },
    },
  ];
};
