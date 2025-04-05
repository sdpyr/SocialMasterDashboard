import * as React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<T> {
  columns: {
    id: string;
    header: string;
    cell: (row: T) => React.ReactNode;
    className?: string;
  }[];
  data: T[];
  pagination?: boolean;
  pageSize?: number;
}

export function DataTable<T>({ 
  columns, 
  data, 
  pagination = false, 
  pageSize = 10 
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(0);
  const totalPages = pagination ? Math.ceil(data.length / pageSize) : 1;
  
  const paginatedData = pagination 
    ? data.slice(page * pageSize, (page + 1) * pageSize) 
    : data;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((column) => (
                  <TableCell key={`${rowIdx}-${column.id}`} className={column.className}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Veri bulunamadı.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Sayfa {page + 1} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}