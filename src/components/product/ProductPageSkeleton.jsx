import React from "react";
import Container from "../Container";
import { Skeleton } from "../ui/skeleton";

function ProductPageSkeleton() {
  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
      <div className="md:col-span-2">
        <Skeleton className="h-6 w-64 mb-4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </Container>
  );
}

export default ProductPageSkeleton;
