"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}) {
  return (
    (<TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props} />)
  );
}

function TabsList({
  className,
  ...props
}) {
  return (
    (<TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground inline-flex h-10 w-full items-center border-b-2 gap-8 scrollbar-hide overflow-x-auto",
        className
      )}
      {...props} />)
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    (<TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "dark:data-[state=active]:text-foreground focus-visible:ring-ring/50  dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-muted-foreground dark:text-muted-foreground inline-flex h-full items-center justify-center gap-1.5 border-accent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:border-b-2 hover:text-primary data-[state=active]:font-semibold data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:text-primary",
        className
      )}
      {...props} />)
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    (<TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none w-full", className)}
      {...props} />)
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
