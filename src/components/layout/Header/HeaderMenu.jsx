"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerData } from "@/constants";

const HeaderMenu = ({ categories }) => {
  const pathname = usePathname();
  return (
    <nav className="hidden lg:inline-flex w-1/3 items-center gap-5 text-sm capitalize font-semibold">
      {headerData.map((item) => (
        <Link
          href={item?.href}
          key={item?.title}
          className={`hover:text-foreground hoverEffect relative group ${pathname === item?.href ? "text-foreground" : "text-muted-foreground"}`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0.5 left-0 h-0.5 bg-foreground group-hover:w-full hoverEffect ${pathname === item?.href ? "w-full" : "w-0"}`}
          ></span>
        </Link>
      ))}
    </nav>
  );
};

export default HeaderMenu;
