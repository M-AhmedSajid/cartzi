import React from "react";
import HeaderMenu from "./HeaderMenu";
import Logo from "../Logo";
import Container from "../Container";
import MobileMenu from "./MobileMenu";
import CartIcon from "../CartIcon";
import { Button } from "../ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { ListOrdered, Search } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogTrigger } from "../ui/dialog";
import SearchDialog from "../SearchDialog";

const Header = async () => {
  const user = await currentUser();
  return (
    <header className="border-b border-border py-5 sticky top-0 bg-background z-10">
      <Container className="flex items-center justify-between gap-7 text-foreground">
        <HeaderMenu />
        <div className="w-auto lg:w-1/3 flex justify-center items-center gap-2.5">
          <MobileMenu />
          <Logo>Cartzi</Logo>
        </div>
        <div className="w-auto lg:w-1/3 flex justify-end items-center gap-5">
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
              <SignInButton mode="modal">
                <Button variant="ghost">Login</Button>
              </SignInButton>
            )}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
