"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

async function getData() {
  // Fetch data from your API here.
  return [
    { s_id: 1, name: "John Doe" },
    { s_id: 2, name: "Jane Smith" },
    { s_id: 3, name: "Alice Johnson" },
    { s_id: 4, name: "Bob Brown" },
    { s_id: 1, name: "John Doe" },
    { s_id: 2, name: "Jane Smith" },
    { s_id: 3, name: "Alice Johnson" },
    { s_id: 4, name: "Bob Brown" },
    { s_id: 1, name: "John Doe" },
    { s_id: 2, name: "Jane Smith" },
    { s_id: 3, name: "Alice Johnson" },
    { s_id: 4, name: "Bob Brown" },
    { s_id: 1, name: "John Doe" },
    { s_id: 2, name: "Jane Smith" },
    { s_id: 3, name: "Alice Johnson" },
    { s_id: 4, name: "Bob Brown" },
    { s_id: 1, name: "John Doe" },
    { s_id: 2, name: "Jane Smith" },
    { s_id: 3, name: "Alice Johnson" },
    { s_id: 4, name: "Bob Brown" },
    { s_id: 1, name: "John Doe" },
    { s_id: 2, name: "Jane Smith" },
    { s_id: 3, name: "Alice Johnson" },
    { s_id: 4, name: "Bob Brown" },
  ];
}

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "s_id",
    header: "Student ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("s_id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
  },
];

const StudentSelection = ({ setData, btnEnable }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [filteredStuData, setFilteredStuData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [stuData, setStuData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getData();
      setStuData(data);
      setFilteredStuData(data);
    };

    load();
  }, []);

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    let filtData = searchValue
      ? stuData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.s_id
              .toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
        )
      : stuData;

    setFilteredStuData(filtData);
  }, [searchValue]);

  const table = useReactTable({
    data: filteredStuData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    setSelectedStudents(
      table.getFilteredSelectedRowModel().rows.map((obj) => obj.original.s_id)
    );
  }, [table.getFilteredSelectedRowModel().rows]);

  useEffect(() => {
    setData((cur) => ({ ...cur, students: selectedStudents }));
  }, [selectedStudents]);

  useEffect(() => {
    table.getFilteredSelectedRowModel().rows = [];
  }, [btnEnable]);

  return (
    <div className="w-full">
      <div className="flex items-center py-2 mx-8">
        <Input
          placeholder="Search by student id or name"
          onChange={(e) => onSearchChange(e)}
          value={searchValue}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border max-h-[370px] min-h-[370px] mx-8 overflow-y-scroll">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 mx-8">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
};

export default StudentSelection;
