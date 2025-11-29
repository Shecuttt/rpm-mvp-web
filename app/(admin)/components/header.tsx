import { User } from "@supabase/supabase-js";
import { Database } from "@/lib/types";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AdminHeader({
  user,
  profile,
}: {
  user: User;
  profile: Profile;
}) {
  const getInitials = () => {
    if (profile.name) {
      const names = profile.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return user.email?.[0].toUpperCase() || "A";
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/50 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex ml-auto items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium capitalize">
                {profile.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
