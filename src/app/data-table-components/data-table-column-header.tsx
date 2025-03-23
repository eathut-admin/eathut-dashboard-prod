"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { TbArrowsUpDown } from "react-icons/tb";
import { Column } from "@tanstack/react-table";

interface DataTableColumnHeaderProps {
  column: Column<any>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader({
  column,
  title,
  className,
}: DataTableColumnHeaderProps) {
  return (
    <div
      className={cn("flex items-center space-x-2 cursor-pointer", className)}
      onClick={() => column.toggleSorting()}>
      <span>{title}</span>
      {column.getIsSorted() !== undefined && column.columnDef.enableSorting && (
        <>
          {column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="h-3 w-3" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="h-3 w-3" />
          ) : (
            <TbArrowsUpDown className="h-3 w-3" />
          )}
        </>
      )}
    </div>
  );
}
