import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toggler";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
 const session = false;
  return (
    <div className="sticky top-0 flex items-center justify-between border-b-2 border-orange-500 bg-background px-12 py-2 text-center">
      <div className="flex items-center space-x-8">
        <Link
          href="/"
          className="mr-12 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-xl font-bold tracking-wide text-transparent"
        >
          puanlojik
        </Link>
        <Link href="/">keşfet</Link>
        <Link href="/about">biz kimiz?</Link>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"outline"} size={"icon"}>
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Profil
              </DropdownMenuItem>
              <Link href="/app/adverts/saved-adverts">
                <DropdownMenuItem className="cursor-pointer">
                  Kaydedilenler
                </DropdownMenuItem>
              </Link>

              <Link href="/app/adverts/my-adverts">
                <DropdownMenuItem className="cursor-pointer">
                  İlanlarım
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer">
                Ayarlar
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={() => signOut()}
              >
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="purple">
            <Link href="/login">Giriş Yap</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;