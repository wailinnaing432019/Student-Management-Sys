"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination?: {
        currentPage: number
        totalPages: number
        onPageChange: (page: number) => void
    }
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })


    return (
        <div className="rounded-xl border shadow-sm">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-muted">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-red-500">
                                ဘာသာရပ်များ မရှိပါ။ ဖန်တီးဖို့ လိုအပ်ပါသည်။
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {pagination && (
                <div className="flex items-center justify-between p-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> ရှေ့သို့
                    </Button>

                    <div className="text-sm">
                        စာမျက်နှာ {pagination.currentPage} ၏ {pagination.totalPages}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >
                        နောက်သို့ <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    )
}
