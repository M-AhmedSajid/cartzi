"use client";
import React from "react";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { headerData } from "../../constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "../SocialMedia";

const Sidebar = ({ isOpen, onClose }) => {
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
        <nav className="flex flex-col gap-3.5 font-semibold tracking-wide w-fit">
          {headerData.map((item) => (
            <Link
              onClick={onClose}
              href={item?.href}
              key={item?.title}
              className={`hover:text-foreground hoverEffect ${
                pathname === item?.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item?.title}
            </Link>
          ))}
        </nav>
        <SocialMedia />
      </div>
    </div>
  );
};

export default Sidebar;
