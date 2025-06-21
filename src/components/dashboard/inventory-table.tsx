
"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, differenceInDays } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InventoryItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EXPIRY_THRESHOLD_DAYS = 15;
const LOW_STOCK_THRESHOLD = 10;

type ItemStatus = 'Available' | 'Low' | 'Expiring Soon';

const getItemStatus = (item: InventoryItem): ItemStatus => {
  const daysLeft = differenceInDays(new Date(item.expiryDate), new Date());
  if (daysLeft < 0) return 'Expiring Soon'; // Should be handled as expired but for status let's group here.
  if (daysLeft < EXPIRY_THRESHOLD_DAYS) return 'Expiring Soon';
  if (item.quantity < LOW_STOCK_THRESHOLD) return 'Low';
  return 'Available';
};

const getStatusBadgeVariant = (status: ItemStatus) => {
  switch (status) {
    case 'Available':
      return 'secondary';
    case 'Low':
      return 'default';
    case 'Expiring Soon':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "bloodType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Blood Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium text-primary">{row.getValue("bloodType")}</div>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
         <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Quantity (Units)
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
        const date = new Date(row.getValue("expiryDate") as string);
        const daysUntilExpiry = differenceInDays(date, new Date());
        return (
            <div>
                <div>{format(date, 'MMM dd, yyyy')}</div>
                <div className={cn("text-xs", daysUntilExpiry < EXPIRY_THRESHOLD_DAYS ? "text-destructive" : "text-muted-foreground")}>
                    {daysUntilExpiry >= 0 ? `${daysUntilExpiry} days left` : 'Expired'}
                </div>
            </div>
        )
    }
  },
  {
    id: "status",
    accessorFn: (row) => getItemStatus(row),
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as ItemStatus;
        return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    },
  },
];

interface InventoryTableProps {
  data: InventoryItem[];
}

export default function InventoryTable({ data }: InventoryTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter by blood type..."
          value={(table.getColumn("bloodType")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("bloodType")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) => {
            if (value === "all") {
                table.getColumn("status")?.setFilterValue(undefined)
            } else {
                table.getColumn("status")?.setFilterValue(value)
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No inventory data. Donations can be added via the 'Become a Donor' page.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) found.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
