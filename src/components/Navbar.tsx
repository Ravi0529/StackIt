"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, CreditCard, User as UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@prisma/client";
import NotificationIcon from "./NotificationIcon";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-30 w-full bg-[#0f0f11] border-b border-[#2a2a36] shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/feed"
            className="flex items-center gap-2 group select-none"
          >
            <span className="text-2xl font-extrabold tracking-tight text-white font-serif">
              StackIt
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-4">
                <NotificationIcon />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 border border-[#3a3a47] hover:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={(user as any)?.image || undefined}
                          alt={user?.username || user?.email || "User"}
                        />
                        <AvatarFallback className="bg-[#1f1f29] text-white">
                          {user?.username?.[0]?.toUpperCase() ||
                            user?.email?.[0]?.toUpperCase() || (
                              <UserIcon className="h-5 w-5" />
                            )}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1a1a22] border border-[#2e2e3e] rounded-md text-white shadow-lg"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/profile/${user.id}`}
                        className="flex items-center px-2 py-2 w-full hover:bg-[#2a2a36] rounded-sm transition"
                      >
                        <CreditCard className="mr-2 h-4 w-4 text-white" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-red-500 hover:bg-red-900/40 transition rounded-sm"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="default"
                asChild
                size="lg"
                className="px-5 text-sm font-semibold bg-zinc-100 text-black hover:bg-zinc-200 transition font-sans"
              >
                <Link href="/signin">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
