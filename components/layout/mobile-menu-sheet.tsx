import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { createClient } from "@/utils/supabase/server";
import { getProfileById } from "@/lib/action/profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ThemeToggle from "./theme-toggle";

// MAIN COMPONENT
export default function MobileMenuSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>

      <SheetContent className="w-64 px-6" side="left">
        <SheetTitle className="mt-2">
          <ThemeToggle />
        </SheetTitle>
        <VisuallyHidden>
          <SheetDescription>Menu navigasi aplikasi</SheetDescription>
        </VisuallyHidden>

        <nav className="flex flex-col h-full space-y-4 mt-8 text-lg font-medium">
          <SheetClose asChild>
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/products"
              className="hover:text-primary transition-colors"
            >
              Produk
            </Link>
          </SheetClose>

          {/* orders + account section */}
          <OrderAndAccountSection />
        </nav>

        <SheetFooter>
          <div className="mt-auto mx-auto text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Ragil Putra Mandiri
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ==== SERVER COMPONENT ====

async function OrderAndAccountSection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfileById(user.id) : null;

  // safer color generator
  const getAvatarColor = (id?: string | null) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];

    if (!id) return "bg-slate-900 text-white"; // safe fallback

    const index = id.charCodeAt(0) % colors.length;
    return `${colors[index]} text-white`;
  };

  // if NOT logged in
  if (!user) {
    return (
      <SheetClose asChild>
        <Link href="/login" className="text-base hover:text-primary mt-auto">
          Login
        </Link>
      </SheetClose>
    );
  }

  const name = profile?.name || "User";
  const email = profile?.email || "";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <>
      <SheetClose asChild>
        <Link href="/orders" className="hover:text-primary transition-colors">
          Pesanan
        </Link>
      </SheetClose>

      <SheetClose asChild>
        <Link
          href="/account"
          className="w-full mt-auto flex items-center gap-3 p-3 rounded-xl bg-secondary transition"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || ""} alt={name} />

            <AvatarFallback className={getAvatarColor(profile?.id)}>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate capitalize">{name}</p>
            {email && (
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            )}
          </div>
        </Link>
      </SheetClose>
    </>
  );
}
