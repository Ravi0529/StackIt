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

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/feed"
            className="flex items-center gap-2 group select-none"
          >
            <span className="text-2xl font-abold text-black tracking-tight transition-colors group-hover:text-primary">
              StackIt
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 border-2 border-muted-foreground/20 hover:border-primary/60 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Avatar>
                      <AvatarImage
                        src={(user as any)?.image || undefined}
                        alt={user?.username || user?.email || "User"}
                      />
                      <AvatarFallback>
                        {user?.username?.[0]?.toUpperCase() ||
                          user?.email?.[0]?.toUpperCase() || (
                            <UserIcon className="h-5 w-5" />
                          )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="default"
                  asChild
                  size="lg"
                  className="px-5 font-semibold"
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="px-5 font-semibold"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
