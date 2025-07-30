"use client";
import { AlignLeft } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        className="md:hidden"
        size="icon"
        onClick={() => setIsSidebarOpen(true)}
      >
        <AlignLeft className="text-muted-foreground hover:text-foreground hoverEffect" />
      </Button>
      <div className="md:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
};

export default MobileMenu;
