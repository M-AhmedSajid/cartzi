"use client";
import React from "react";
import Logo from "../Logo";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import SocialMedia from "@/components/SocialMedia";
import { headerData } from "@/constants";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const Sidebar = ({ isOpen, onClose, menu, links }) => {
  const pathname = usePathname();
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
            <X />
          </Button>
        </div>
        <nav className="flex flex-col font-semibold tracking-wide">
          {menu?.items?.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {menu.items.map((cat) => {
                const isActive = pathname === cat.href;
                const hasDropdown = cat.children?.items?.length > 0;
                if (hasDropdown) {
                  return (
                    <AccordionItem key={cat.label} value={cat.label}>
                      <AccordionTrigger className="p-2">
                        <Link
                          onClick={onClose}
                          href={cat.href}
                          className={`${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {cat.label}
                        </Link>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col gap-2 pl-2">
                          {cat.children.items.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                onClick={onClose}
                                href={sub.href}
                                className={`p-2 ${
                                  pathname === sub.href
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                }
                return (
                  <AccordionItem key={cat.label}>
                    <Link
                      onClick={onClose}
                      href={cat.href}
                        className={`w-full block p-2 ${
                        isActive ? "text-foreground" : "text-muted-foreground"
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
                href={item?.href}
                key={item?.title}
                className={`p-2 border-b last:border-b-0
                  ${pathname === item?.href
                    ? "text-foreground"
                    : "text-muted-foreground"}
                `}
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
