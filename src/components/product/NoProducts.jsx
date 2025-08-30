import React from "react";
import { Package, Search, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";

const NoProducts = ({ activeTab }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Animated Icon Container */}
      <div className="relative mt-8 animate-bounce">
        <div className="bg-background p-5 rounded-full shadow-lg border border-border">
          <Package className="size-10 text-muted-foreground" />
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-2xl font-bold text-foreground">
          No Products Found
        </h3>

        <p className="text-muted-foreground text-base">
          We couldn't find any products in <strong>{activeTab}</strong> category
          at the moment.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-3">
          <Button>
            <Search className="size-4" />
            Browse All Products
          </Button>

          <Button variant="outline">
            <ShoppingBag className="size-4" />
            View Categories
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoProducts;
