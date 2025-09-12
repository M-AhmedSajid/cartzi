"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { headerData } from "@/constants";

const HeaderMenu = ({ menu }) => {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold capitalize w-1/3">
      {menu?.items?.length > 0
        ? menu?.items?.map((item) => {
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
          })
        : headerData.map((item) => (
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
