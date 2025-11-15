import Link from "next/link";
import Image from "next/image";
import MobileMenuSheet from "./mobile-menu-sheet";
import AuthButton from "./auth-button";
import CartButton from "./cart-button";

export default function Navbar() {
  return (
    <nav className="fixed md:sticky left-0 z-50 w-full bg-white/50 backdrop-blur-md border-b md:top-0">
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
            <span className="text-2xl font-bold text-accent-foreground">
              Store
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <CartButton />
            <AuthButton />
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
