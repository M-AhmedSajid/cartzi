"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PortableText } from "next-sanity";
import ReviewTab from "./ReviewTab";

const ProductTabs = ({ product }) => {
  const components = {
    block: {
      h2: ({ children }) => (
        <h2 className="text-xl font-bold mt-4 mb-2">{children}</h2>
      ),
      normal: ({ children }) => (
        <p className="mb-3 leading-relaxed">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside space-y-1 pl-4">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside space-y-1 pl-4">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-muted-foreground">{children}</li>
      ),
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:opacity-80"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <Tabs defaultValue="description" className="gap-4">
      <TabsList className="border-b h-10 bg-background rounded-none w-full justify-start p-0 gap-8">
        <TabsTrigger
          value="description"
          className="data-[state=active]:shadow-none flex-none hover:border-b border-accent border-0 rounded-none hover:text-primary data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="data-[state=active]:shadow-none flex-none hover:border-b border-accent border-0 rounded-none hover:text-primary data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground"
        >
          Reviews ({product?.reviewCount})
        </TabsTrigger>
        <TabsTrigger
          value="qanda"
          className="data-[state=active]:shadow-none flex-none hover:border-b border-accent border-0 rounded-none hover:text-primary data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground"
        >
          Q&As
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <PortableText value={product.description} components={components} />
      </TabsContent>
      <TabsContent value="reviews">
        <ReviewTab product={product} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
