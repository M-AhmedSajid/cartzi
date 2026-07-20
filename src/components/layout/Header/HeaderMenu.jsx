"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { buildHrefWithParams } from "@/lib/products";

const HeaderMenu = ({ menu }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const items = menu?.items ?? [];
  const [maxVisible, setMaxVisible] = useState(5);

  useEffect(() => {
    const handleResize = () => setMaxVisible(window.innerWidth >= 1280 ? 7 : 5);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkIsActive = (item) => {
    if (pathname === item.href) return true;
    const subItems = item.children?.items ?? [];
    return (
      subItems.length > 0 && subItems.some((subItem) => checkIsActive(subItem))
    );
  };

  const visibleItems = items.slice(0, maxVisible);
  const overflowItems = items.slice(maxVisible);

  const displayItems = [...visibleItems];
  if (overflowItems.length > 0) {
    displayItems.push({
      label: "More",
      href: "#",
      children: { items: overflowItems },
    });
  }

  const MenuItem = ({ item, isSubmenu = false }) => {
    const isExactActive = pathname === item.href;
    const isBranchActive = checkIsActive(item);

    const subItems = item.children?.items ?? [];
    const hasDropdown = subItems.length > 0;

    let activeStyles = "";
    if (isSubmenu) {
      activeStyles = isExactActive
        ? "bg-primary text-primary-foreground font-medium"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground";
    } else {
      activeStyles = isBranchActive
        ? "text-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground";
    }

    return (
      <div className="relative group/item">
        {/* 2. Pass item.href and searchParams into shared helper */}
        <Link
          href={buildHrefWithParams(item.href, pathname, searchParams)}
          className={`flex items-center justify-between gap-1 rounded-md text-sm hoverEffect ${
            isSubmenu ? "px-3 py-2 w-full" : "relative py-1"
          } ${activeStyles}`}
        >
          {item.label || item.name}

          {hasDropdown &&
            (isSubmenu ? (
              <FiChevronRight className="size-4 ml-auto" />
            ) : (
              <FiChevronDown className="size-4 group-hover/item:rotate-180 hoverEffect" />
            ))}

          {!isSubmenu && (
            <span
              className={`absolute -bottom-0.5 left-0 h-0.5 bg-foreground group-hover/item:w-full hoverEffect ${
                isBranchActive ? "w-full" : "w-0"
              }`}
            />
          )}
        </Link>

        {hasDropdown && (
          <div
            className={`absolute z-10 hidden group-hover/item:block animate-in fade-in slide-in-from-top-1 ${
              isSubmenu ? "left-full top-0 pl-1" : "left-0 top-full pt-2"
            }`}
          >
            <ul className="flex flex-col p-1.5 rounded-lg border bg-background shadow-xl min-w-44 w-max">
              {subItems.map((sub, idx) => (
                <li key={sub.href || idx}>
                  <MenuItem item={sub} isSubmenu={true} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="flex items-center gap-4 xl:gap-6 text-sm font-semibold capitalize">
      {displayItems.map((item, idx) => (
        <MenuItem key={item.href || idx} item={item} />
      ))}
    </nav>
  );
};

export default HeaderMenu;
