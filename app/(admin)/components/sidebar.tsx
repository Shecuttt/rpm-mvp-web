"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  Settings,
  LogOut,
} from "lucide-react";
import ThemeToggle from "@/components/layout/theme-toggle";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="lg:hidden fixed inset-0 z-40 bg-gray-600/75" />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 lg:block bg-gray-50 dark:bg-gray-900">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 bg-secondary border-b border-secondary-foreground">
            <Link href="/admin" className="text-xl font-bold">
              Admin Panel
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-accent"
                      : "text-foreground hover:bg-primary hover:text-accent"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 shrink-0",
                      isActive
                        ? "text-accent"
                        : "text-secondary-foreground group-hover:text-accent"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Back to Store */}
          <div className="border-t border-primary/10 p-4">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-gray-200 rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-accent-foreground" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
