import { useMemo, useState } from "react";
import { Edit, Trash2, MoreVertical, ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  price: number;
  supplier: string;
}

type SortKey = "name" | "sku" | "category" | "quantity" | "price";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  isLoading?: boolean;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  isLoading,
}: ProductTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= minStock) {
      return (
        <Badge className="bg-yellow-500/90 text-yellow-950 hover:bg-yellow-500">
          Low Stock
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-500/90 text-emerald-950 hover:bg-emerald-500">
        In Stock
      </Badge>
    );
  };

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    copy.sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortKey === "price" || sortKey === "quantity") {
        return dir * (a[sortKey] - b[sortKey]);
      }
      return dir * a[sortKey].localeCompare(b[sortKey]);
    });
    return copy;
  }, [products, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border bg-white/80 p-2 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between px-2 pt-1">
        <p className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {products.length === 0
              ? 0
              : (page - 1) * pageSize + 1}{" "}
            -{" "}
            {Math.min(page * pageSize, sortedProducts.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700">
            {sortedProducts.length}
          </span>{" "}
          products
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-600"
                  onClick={() => handleSort("name")}
                >
                  Product Name
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-600"
                  onClick={() => handleSort("sku")}
                >
                  SKU
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-600"
                  onClick={() => handleSort("category")}
                >
                  Category
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-600"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-600"
                  onClick={() => handleSort("price")}
                >
                  Price
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={8} className="py-3">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-gray-500"
                >
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {product.sku}
                  </TableCell>
                  <TableCell className="capitalize text-gray-600">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {product.supplier}
                  </TableCell>
                  <TableCell>
                    {getStockStatus(product.quantity, product.minStock)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {sortedProducts.length > pageSize && (
        <div className="flex items-center justify-end px-2 pb-1">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="rounded-md px-2 py-1 text-xs text-gray-600">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  aria-disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
