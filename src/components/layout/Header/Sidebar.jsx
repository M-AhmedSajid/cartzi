"use client";
import React from "react";
import Logo from "../Logo";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SocialMedia from "@/components/SocialMedia";
import { headerData } from "@/constants";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { buildHrefWithParams } from "@/lib/products";

const Sidebar = ({ isOpen, onClose, menu, links }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // 3. Grab current search params

  // Deeply checks if a parent node or its nested children are active
  const checkIsActive = (item) => {
    if (pathname === item.href) return true;
    const subItems = item.children?.items ?? [];
    return subItems.some((subItem) => pathname === subItem.href);
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-foreground hoverEffect w-full ${
          isOpen ? "opacity-50 z-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed inset-y-0 min-w-72 max-w-96 z-50 bg-background left-0 p-10 border-r flex flex-col gap-6 shadow-2xl hoverEffect cursor-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo onClick={onClose} className="text-foreground">
            Cartzi
          </Logo>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <FiX />
          </Button>
        </div>
        <nav className="flex flex-col font-semibold tracking-wide">
          {menu?.items?.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {menu.items.map((cat) => {
                const isExactActive = pathname === cat.href;
                const isBranchActive = checkIsActive(cat);
                const hasDropdown = cat.children?.items?.length > 0;
                if (hasDropdown) {
                  return (
                    <AccordionItem key={cat.label} value={cat.label}>
                      <AccordionTrigger className="p-2">
                        <Link
                          onClick={onClose}
                          href={buildHrefWithParams(
                            cat.href,
                            pathname,
                            searchParams,
                          )}
                          className={`${
                            isBranchActive
                              ? "text-foreground font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {cat.label}
                        </Link>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col gap-1 pl-2 pt-1">
                          {cat.children.items.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <li key={sub.href}>
                                <Link
                                  onClick={onClose}
                                  href={buildHrefWithParams(
                                    sub.href,
                                    pathname,
                                    searchParams,
                                  )}
                                  className={`block p-2 text-sm rounded-md transition-colors ${
                                    isSubActive
                                      ? "bg-primary text-primary-foreground font-medium"
                                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                }
                return (
                  <AccordionItem key={cat.label}>
                    <Link
                      onClick={onClose}
                      href={buildHrefWithParams(
                        cat.href,
                        pathname,
                        searchParams,
                      )}
                      className={`w-full block p-2 rounded-md ${
                        isExactActive
                          ? "text-foreground font-semibold bg-accent"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            headerData.map((item) => (
              <Link
                onClick={onClose}
                href={buildHrefWithParams(item?.href, pathname, searchParams)}
                key={item?.title}
                className={`p-2 border-b last:border-b-0 transition-colors ${
                  pathname === item?.href
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item?.title}
              </Link>
            ))
          )}
        </nav>
        <SocialMedia links={links} />
      </div>
    </div>
  );
};

export default Sidebar;
