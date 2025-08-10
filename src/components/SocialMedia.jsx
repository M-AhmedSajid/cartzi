import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { socialLinks } from "../constants";
import Link from "next/link";
import { Button } from "./ui/button";

const SocialMedia = () => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3.5">
        {socialLinks.map((link) => (
          <Tooltip key={link?.title}>
            <TooltipTrigger asChild>
              <Button asChild size="icon" variant="outline" className="rounded-full">
                <Link href={link?.href} target="_blank" rel="noopener noreferrer">{link?.icon}</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{link?.title}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
