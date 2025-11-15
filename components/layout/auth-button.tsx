import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LogoutButton from "../auth/logout-button";
import { getProfileById } from "@/lib/action/profile";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link href="/login" className="relative">
        <Button>Login</Button>
      </Link>
    );
  }

  const profile = await getProfileById(user.id);

  // Generate initial dari nama
  const getInitials = () => {
    if (profile?.name) {
      const names = profile.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return user.email?.[0].toUpperCase() || "U";
  };

  // Generate random color based on user ID (biar konsisten)
  const getAvatarColor = () => {
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
    const index = user.id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={profile?.avatar_url || ""} alt="user avatar" />
            <AvatarFallback
              className={`w-8 h-8 rounded-full ${getAvatarColor()} text-white font-semibold`}
            >
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        {profile && (
          <DropdownMenuContent align="end" className="focus:outline-none">
            <DropdownMenuLabel className="capitalize">
              {profile?.name || "No Name"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account" className="relative">
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="relative">
                  Orders
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton variant="text" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  );
}
