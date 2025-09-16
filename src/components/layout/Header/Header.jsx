import React from "react";
import HeaderMenu from "./HeaderMenu";
import Logo from "../Logo";
import MobileMenu from "./MobileMenu";
import { Button } from "../../ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { ListOrdered, Search } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogTrigger } from "../../ui/dialog";
import SearchDialog from "../../SearchDialog";
import CartIcon from "@/components/product/CartIcon";
import {
  getMenuForHeader,
  getMenuForMobileSidebar,
} from "@/sanity/helpers/menu";
import { getSocialLinks } from "@/sanity/helpers";

const Header = async () => {
  const user = await currentUser();
  const menuForHeader = await getMenuForHeader();
  const menuForMobile = await getMenuForMobileSidebar();
  const links = await getSocialLinks();

  return (
    <header className="border-b border-border py-4 md:py-5 sticky top-0 bg-background z-20">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-7 text-foreground">
        {/* Left: Menu */}
        <div className="hidden lg:flex justify-start min-w-0">
          <HeaderMenu menu={menuForHeader} />
        </div>

        {/* Center: Logo */}
        <div className="flex justify-start lg:justify-center items-center gap-2.5">
          <MobileMenu menu={menuForMobile} links={links} />
          <Logo>Cartzi</Logo>
        </div>

        {/* Right: Actions */}
        <div className="flex justify-end items-center gap-4 md:gap-6">
          <Dialog>
            <DialogTrigger>
              <Search className="w-5 h-5 text-muted-foreground hover:text-foreground hoverEffect" />
            </DialogTrigger>
            <SearchDialog />
          </Dialog>
          <CartIcon />
          <ClerkLoaded>
            <SignedIn>
              <Link href={"/orders"} className="relative group">
                <ListOrdered className="w-5 h-5 text-muted-foreground group-hover:text-foreground hoverEffect" />
                <span className="absolute -top-1 -right-1 bg-foreground text-background w-3.5 h-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                  0
                </span>
              </Link>
              <UserButton />
            </SignedIn>
            {!user && (
              <SignInButton
                mode="modal"
                fallback={<Button variant="ghost">Loading...</Button>}
              >
                <Button variant="ghost">Login</Button>
              </SignInButton>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};

export default Header;
