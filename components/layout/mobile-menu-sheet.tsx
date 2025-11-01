"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function MobileMenuSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-64 px-6">
        {/* Hidden title untuk accessibility */}
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Menu untuk navigasi di aplikasi</SheetDescription>
        </VisuallyHidden>
        <nav className="flex flex-col space-y-4 mt-8 text-lg font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link
            href="/products"
            className="hover:text-primary transition-colors"
          >
            Products
          </Link>
        </nav>
        <SheetFooter>
          <div
            className="mt-auto
          "
          >
            <p className="text-xs">
              &copy; {new Date().getFullYear()} Ragil Putra Mandiri
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
