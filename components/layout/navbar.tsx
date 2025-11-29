import Link from "next/link";
import Image from "next/image";
import MobileMenuSheet from "./mobile-menu-sheet";
import AuthButton from "./auth-button";
import CartButton from "./cart-button";
import ScrollHideWrapper from "./scroll-hide-wrapper";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  return (
    <ScrollHideWrapper>
      <div className="w-full bg-neutral-50 dark:bg-neutral-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Desktop */}
          <div className="hidden md:flex w-full items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/rpm-header.png"
                width={30}
                height={30}
                alt="RPM Store"
                className="dark:invert"
              />
              <span className="text-2xl font-bold dark:text-accent-foreground">
                Store
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <CartButton />
              <AuthButton />
            </div>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden w-full justify-between items-center">
            <MobileMenuSheet />
            <Link href="/" className="flex items-center">
              <Image
                src="/rpm-header.png"
                width={30}
                height={30}
                alt="RPM Store"
                className="dark:invert"
              />
            </Link>
            <CartButton />
          </div>
        </div>
      </div>
    </ScrollHideWrapper>
  );
}
