import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead className="hidden sm:table-cell">Type</TableHead>
        <TableHead className="hidden sm:table-cell">Plan</TableHead>
        <TableHead className="hidden md:table-cell">Date</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[1, 2, 3, 4, 5].map((index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className=" h-5 w-3/4 " />
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <Skeleton className=" h-5 w-2/4 " />
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <Skeleton className=" h-5 w-1/4 " />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <Skeleton className=" h-5 w-1/4 " />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className=" h-5 w-1/5 " />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
