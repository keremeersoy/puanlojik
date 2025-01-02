'use client';

import Link from 'next/link';
import React from 'react';
import { ModeToggle } from './mode-toggler';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { LogOut, User, ReloadIcon, RotateCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { auth } from '@/lib/firebase';
import { Auth as AuthService } from '@/services/Auth';
import useUser from '@/hooks/use-user';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { user, loading } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="sticky top-0 flex items-center justify-between border-b-2 border-orange-500 dark:bg-[#121212] bg-white z-10 px-12 py-2 text-center shadow-md">
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
        {loading && <RotateCw className="text-orange-500 animate-spin" />}
        {user && !loading && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'outline'} size={'icon'}>
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profil</DropdownMenuItem>

              <Link href="/app/comments/my-comments">
                <DropdownMenuItem className="cursor-pointer">Yorumlarım</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer">Ayarlar</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                <LogOut size={18} />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!user && !loading && (
          <Button asChild variant="orange">
            <Link href="/auth/login">Giriş Yap</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
