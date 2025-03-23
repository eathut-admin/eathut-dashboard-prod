"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IoSearchOutline } from "react-icons/io5";
import { DataTablePagination } from "../data-table-pagination";
import { CalendarDatePicker } from "../calendar-date-picker";
import { Button } from "@/components/ui/button";
import { BsFiletypeXlsx } from "react-icons/bs";
import * as XLSX from "xlsx";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DataTableProps<TData extends { [key: string]: any }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function AllCustomerPageDataTable<
  TData extends { [key: string]: any },
  TValue
>({ columns, data }: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("lastOrderDate")?.setFilterValue([from, to]);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");

    XLSX.writeFile(wb, "customers.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-10">
            <div className="flex justify-center border-2 items-center max-w-sm md:min-w-96 px-5 bg-[#fff] text-black h-12 rounded-full group focus-within:ring-2 focus-within:ring-[#657eff]">
              <IoSearchOutline className="font-bold text-[16px]" />
              <Input
                placeholder="Search..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className={cn(
                  "group outline-none border-none text-[15px] bg-[#fff] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                )}
              />
            </div>

            <CalendarDatePicker
              date={dateRange}
              onDateSelect={handleDateSelect}
              className="h-12 w-[250px] rounded-full"
              variant="default"
            />
            {isFiltered && (
              <Button
                variant="destructive"
                onClick={() => table.resetColumnFilters()}
                className="h-12 w-[100px] rounded-full">
                <Cross2Icon className="" />
                Reset
              </Button>
            )}
          </div>

          <div className="flex gap-3 justify-self-end">
            <Button
              onClick={exportToExcel}
              className="h-12 bg-green-500 hover:bg-green-600 text-white"
              title="Export to Excel">
              <BsFiletypeXlsx />
            </Button>
          </div>
        </div>
      </div>

      {/* Added div for horizontal scrolling */}
      <div className="overflow-x-auto rounded-none border">
        <Table className="border-collapse w-full -z-50">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="border border-gray-300 text-center px-4 py-3 font-bold text-black dark:text-white cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                    key={header.id}
                    colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="border border-gray-300 text-center px-4 py-4 text-black dark:text-white"
                      key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center border border-gray-300">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
