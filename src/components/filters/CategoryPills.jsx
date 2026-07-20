"use client"; // Required to use useSearchParams

import Link from "next/link";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation"; // 1. Import the search params hook
import { Button } from "../ui/button";
import { buildHrefWithParams } from "@/lib/products";

export const CategoryPills = ({ parent, filtersData, currentSlug }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // 2. Grab current active parameters

  const subcategories =
    filtersData?.categories?.filter((cat) => {
      return cat.parent?.name?.toLowerCase() === parent?.toLowerCase();
    }) || [];

  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div className="w-full py-4 border-b border-gray-100 dark:border-gray-800">
      {/* Horizontal scroll container with hidden scrollbar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none md:flex-wrap">
        {subcategories.map((sub) => {
          const isActive = currentSlug === sub.slug;
          // Build base paths
          const targetPath = isActive
            ? `/category/${parent}`
            : `/category/${parent}/${sub.slug}`;
          return (
            <Button
              key={sub._id}
              variant="outline"
              className={`rounded-full px-4 ${
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : ""
              }`}
              asChild
            >
              {/* 3. Wrap your active state condition in the helper helper */}
              <Link href={buildHrefWithParams(targetPath, pathname, searchParams)}>
                {sub.name}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
