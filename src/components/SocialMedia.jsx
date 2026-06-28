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
import { FiFacebook as Facebook, FiGithub as Github, FiInstagram as Instagram, FiLinkedin as Linkedin, FiTwitter as Twitter, FiYoutube as Youtube } from "react-icons/fi";

const socialIcons = {
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
  "Twitter/X": Twitter,
  LinkedIn: Linkedin,
  GitHub: Github,
};

const SocialMedia = ({ links }) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3.5">
        {!links || links.length === 0
          ? socialLinks.map((link) => (
              <Tooltip key={link?.title}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                  >
                    <Link
                      href={link?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link?.icon}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{link?.title}</TooltipContent>
              </Tooltip>
            ))
          : links.map(({ _id, platform, url }) => {
              const Icon = socialIcons[platform];
              return (
                <Tooltip key={_id}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{platform}</TooltipContent>
                </Tooltip>
              );
            })}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
