"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/lib";

const HeaderMenu = ({ menu }) => {
  const pathname = usePathname();
  const items = menu?.items ?? [];

  // Split into visible + overflow
  const isXl = useMediaQuery("(min-width: 1280px)");
  const MAX_VISIBLE = isXl ? 7 : 5;
  const visibleItems = items.slice(0, MAX_VISIBLE);
  const overflowItems = items.slice(MAX_VISIBLE);

  const renderLink = (item) => {
    const isActive = pathname === item.href;
    const hasDropdown = item.children?.items?.length > 0;

    return (
      <div key={item.label} className="relative group">
        <Link
          href={item.href}
          className={`relative flex items-center gap-0.5 hoverEffect group-hover:text-foreground ${
            isActive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {item.label}
          {hasDropdown && (
            <ChevronDown className="size-4 hoverEffect group-hover:rotate-180" />
          )}
          <span
            className={`absolute -bottom-0.5 left-0 h-0.5 bg-foreground group-hover:w-full hoverEffect ${
              isActive ? "w-full" : "w-0"
            }`}
          ></span>
        </Link>

        {hasDropdown && (
          <div className="absolute left-0 pt-2 z-10 hidden group-hover:block">
            <ul className="flex flex-col p-2 rounded-lg border bg-background shadow-xl min-w-40 w-max animate-in fade-in slide-in-from-top-1">
              {item.children.items.map((sub) => (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    className={`block rounded-lg px-3 py-2 text-sm hoverEffect hover:bg-accent hover:text-accent-foreground ${
                      pathname === sub.href
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderOverflowItem = (item) => {
    const hasDropdown = item.children?.items?.length > 0;

    if (hasDropdown) {
      return (
        <DropdownMenuSub key={item.href}>
          <DropdownMenuSubTrigger className="flex items-center justify-between">
            {item.label}
            <ChevronRight className="ml-2 h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {item.children.items.map((sub) => (
              <DropdownMenuItem key={sub.href} asChild>
                <Link href={sub.href}>{sub.name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem key={item.href} asChild>
        <Link href={item.href}>{item.label}</Link>
      </DropdownMenuItem>
    );
  };

  return (
    <nav className="flex items-center gap-4 xl:gap-6 text-sm font-semibold capitalize">
      {visibleItems.map(renderLink)}

      {overflowItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-0.5 text-muted-foreground hover:text-foreground hoverEffect outline-0">
            More
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {overflowItems.map(renderOverflowItem)}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default HeaderMenu;
