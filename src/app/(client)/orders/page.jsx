import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderFilters } from "@/constants";

const OrdersPage = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  //   const orders = await ;
  return (
    <div className="max-w-screen-xl mx-auto py-5 md:py-10 px-4">
      <div className="bg-card px-2 md:px-5">
        <div className="flex items-center justify-between gap-4 py-5 border-b mb-5">
          <div className="flex items-center gap-2">
            <Package />
            <h1 className="text-2xl font-semibold">My Orders</h1>
          </div>
          <div className="gap-2 flex items-center justify-center">
            <Input type="text" placeholder="Search orders..." />
            <Select defaultValue="newest">
              <SelectTrigger className="w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Amount</SelectItem>
                <SelectItem value="lowest">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            {orderFilters.map((filter) => (
              <TabsTrigger value={filter.value}>
                {filter.icon} {filter.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrdersPage;
