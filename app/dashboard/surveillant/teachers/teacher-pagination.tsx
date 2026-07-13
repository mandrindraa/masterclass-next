// components/dashboard/teacher-pagination.tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);

  return pages;
}

export function TeacherPagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => `${basePath}?page=${p}`;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PaginationPrevious href={href(page - 1)} />
          ) : (
            <PaginationPrevious href={href(page)} className="pointer-events-none opacity-40" />
          )}
        </PaginationItem>

        {getPageNumbers(page, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href={href(p)} isActive={p === page}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          {page < totalPages ? (
            <PaginationNext href={href(page + 1)} />
          ) : (
            <PaginationNext href={href(page)} className="pointer-events-none opacity-40" />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
