
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
import type { BloodUnit } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EXPIRY_THRESHOLD_DAYS = 15;

const getStatusBadgeVariant = (status: BloodUnit['status']) => {
  switch (status) {
    case 'Available':
      return 'secondary';
    case 'Reserved':
      return 'default';
    default:
      return 'outline';
  }
};

export const columns: ColumnDef<BloodUnit>[] = [
    {
    accessorKey: "id",
    header: "Unit ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id").substring(5,15)}</div>,
  },
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
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    },
  },
  {
    header: "Blood Bank",
    cell: ({ row }) => {
        const unit = row.original;
        return (
            <div>
                <div className="font-medium">{unit.bloodBankName}</div>
                <div className="text-xs text-muted-foreground">{unit.bloodBankAddress}</div>
            </div>
        )
    }
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as BloodUnit['status'];
        return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    },
  },
];

interface InventoryTableProps {
  data: BloodUnit[];
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
        <Select
          value={(table.getColumn("bloodType")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) => {
            if (value === "all") {
                table.getColumn("bloodType")?.setFilterValue(undefined)
            } else {
                table.getColumn("bloodType")?.setFilterValue(value)
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by blood type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Blood Types</SelectItem>
             {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                <SelectItem key={type} value={type}>
                    {type}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <SelectItem value="Reserved">Reserved</SelectItem>
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
