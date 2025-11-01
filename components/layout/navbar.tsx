"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import Image from "next/image";
import MobileMenuSheet from "./mobile-menu-sheet";

export default function Navbar() {
  return (
    <nav className="fixed md:sticky left-0 z-50 w-full bg-white/90 backdrop-blur-md border-b md:top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop navbar */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={"/rpm-header.png"}
              width={30}
              height={30}
              alt="RPM Store"
            />
            <span className="text-2xl font-bold text-slate-900">Store</span>
          </Link>

          <div className="flex items-center space-x-6">
            <CartButton />
          </div>
        </div>

        {/* Mobile navbar */}
        <div className="flex w-full justify-between items-center md:hidden h-16">
          <Link href="/" className="flex items-center">
            <Image
              src={"/rpm-header.png"}
              width={30}
              height={30}
              alt="RPM Store"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <CartButton />
            <MobileMenuSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}

function CartButton() {
  const { items } = useCartStore();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
