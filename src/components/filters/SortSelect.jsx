import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export const SortSelect = ({ products }) => {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort");
  return (
    <div className="flex items-center justify-between p-5 text-center w-full border md:border-l-0 bg-card rounded-lg md:rounded-none md:rounded-tr-lg">
      <p className="text-base font-medium">
        {products?.length} Product{products?.length !== 1 && "s"}
      </p>
      <Select
        name="sort"
        value={sort || "newest"}
        onValueChange={(value) => {
          const currentParams = Object.fromEntries([...params.entries()]);
          currentParams.sort = value;
          const queryString = new URLSearchParams(currentParams).toString();
          router.push(`?${queryString}`);
        }}
      >
        <SelectTrigger className="w-40 md:w-44">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
          <SelectItem value="rating">Top Rated</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
