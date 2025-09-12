import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-4 md:gap-5 lg:gap-6 rounded-xl border pb-4 md:pb-5 lg:pb-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn("@container/card-header px-4 md:px-5 lg:px-6 flex flex-col justify-between", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h2
      data-slot="card-title"
      className={cn("leading-none text-lg font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return <div data-slot="card-action" className={className} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={className} {...props} />;
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
