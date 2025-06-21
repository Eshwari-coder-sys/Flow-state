
"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User, LogOut, UserCog, AlertTriangle } from "lucide-react";
import { useDonors } from "@/context/donor-context";
import { differenceInDays } from "date-fns";

interface HeaderProps {
  title: string;
}

const EXPIRY_THRESHOLD_DAYS = 15;
const LOW_STOCK_THRESHOLD = 5;

export default function Header({ title }: HeaderProps) {
  const { inventory } = useDonors();

  const availableInventory = inventory.filter(unit => unit.status === 'Available');

  const expiringSoonUnits = availableInventory.filter(item =>
    differenceInDays(new Date(item.expiryDate), new Date()) < EXPIRY_THRESHOLD_DAYS &&
    differenceInDays(new Date(item.expiryDate), new Date()) >= 0
  );

  const bloodTypeCounts = availableInventory.reduce((acc, unit) => {
      acc[unit.bloodType] = (acc[unit.bloodType] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const lowStockBloodTypes = Object.entries(bloodTypeCounts)
    .filter(([_, count]) => count < LOW_STOCK_THRESHOLD)
    .map(([bloodType, count]) => ({ bloodType, count }));

  const hasNotifications = expiringSoonUnits.length > 0 || lowStockBloodTypes.length > 0;

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              {hasNotifications && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                </span>
              )}
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hasNotifications ? (
              <>
                {lowStockBloodTypes.map(({ bloodType, count }) => (
                  <DropdownMenuItem key={`low-${bloodType}`} className="text-destructive">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    <span>Low Stock: {count} unit(s) of {bloodType}</span>
                  </DropdownMenuItem>
                ))}
                {expiringSoonUnits.map((unit) => (
                  <DropdownMenuItem key={unit.id} className="text-destructive">
                     <AlertTriangle className="mr-2 h-4 w-4" />
                    <span>Expiring Soon: Unit {unit.id.substring(5,10)} ({unit.bloodType})</span>
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <DropdownMenuItem>
                <span className="text-muted-foreground">No new notifications</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <UserCog className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
