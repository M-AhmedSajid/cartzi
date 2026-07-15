"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const FilterPagination = ({ currentPage = 1, totalPages = 1 }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!totalPages || totalPages <= 1) return null;

  const buildHref = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (start > 2) pages.push("ellipsis-start");

    for (let page = start; page <= end; page += 1) {
      if (page > 1 && page < totalPages) pages.push(page);
    }

    if (end < totalPages - 1) pages.push("ellipsis-end");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between p-5 text-center w-full border md:border-l-0 bg-card rounded-lg md:rounded-l-none">
      <Pagination>
        <PaginationContent>
          
          {/* PREVIOUS BUTTON */}
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious href={buildHref(currentPage - 1)} replace />
            ) : (
              <PaginationPrevious className="pointer-events-none opacity-50" href="#" />
            )}
          </PaginationItem>

          {/* INDIVIDUAL PAGE NUMBERS */}
          {visiblePages.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <PaginationItem key={`${page}-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const isActive = page === currentPage;
            return (
              <PaginationItem key={page}>
                <PaginationLink href={buildHref(page)} isActive={isActive}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* NEXT BUTTON */}
          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext href={buildHref(currentPage + 1)} replace />
            ) : (
              <PaginationNext className="pointer-events-none opacity-50" href="#" />
            )}
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
};