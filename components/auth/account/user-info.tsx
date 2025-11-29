import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfileById } from "@/lib/action/profile";

export default async function UserInfo() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
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
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <Card className=" md:w-1/2">
        <CardHeader>
          <Avatar className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto">
            <AvatarImage src={profile?.avatar_url || ""} alt="user avatar" />
            <AvatarFallback
              className={`rounded-full ${getAvatarColor()} text-white text-2xl md:text-4xl lg:text-6xl font-semibold`}
            >
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="mx-auto">
          <CardTitle className="md:text-2xl capitalize">
            {profile?.name}
          </CardTitle>
        </CardContent>
        <CardFooter className="mx-auto">
          <CardDescription className="text-muted-foreground capitalize">
            {profile?.role}
          </CardDescription>
        </CardFooter>
      </Card>
      <Card className="md:w-1/2">
        <CardHeader className="text-xl font-bold">Info Akun</CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span>Nama:</span>
              <p className="font-medium capitalize">
                {profile?.name || "Belum diisi"}
              </p>
            </div>
            <div>
              <span>Email:</span>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <span>Alamat:</span>
              <p className="font-medium">{profile?.address || "Belum diisi"}</p>
            </div>
            <div>
              <span>Nomor Telepon:</span>
              <p className="font-medium">{profile?.phone || "Belum diisi"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
