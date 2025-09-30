import { currentUser } from "@clerk/nextjs/dist/types/server";
import { redirect } from "next/navigation";
import React from "react";

const OrdersPage = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

//   const orders = await ;
  return <div>OrdersPage</div>;
};

export default OrdersPage;
