"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { productType } from "../../constants";
import { client } from "@/sanity/lib/client";
import SkelectonCard from "./SkelectonCard";
import ProductCard from "./ProductCard";
import NoProducts from "./NoProducts";

const ProductGrid = () => {
  const [activeTab, setActiveTab] = useState(productType[0]?.title || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = `*[_type == 'product' && variant == $variant] | order(name asc)`;
  const params = { variant: activeTab.toLowerCase() };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(await response);
      } catch (error) {
        console.log("Error in Product Fetching", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-[400px]"
      >
        <TabsList>
          {productType.map((item) => (
            <TabsTrigger value={item?.title} key={item?.title}>
              {item?.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {productType.map((item) => (
          <TabsContent value={item?.title} key={item?.title}>
            {loading ? (
              <SkelectonCard />
            ) : products?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full">
                {products.map((product) => (
                  <ProductCard product={product} key={product?._id} />
                ))}
              </div>
            ) : (
              <NoProducts />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProductGrid;
