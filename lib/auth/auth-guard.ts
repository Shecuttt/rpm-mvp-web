import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export async function AuthGuard({
  children,
  redirectTo = "/login",
}: AuthGuardProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(redirectTo);
  }

  return children;
}

// Usage example in page:
// export default async function ProtectedPage() {
//   return (
//     <AuthGuard>
//       <YourProtectedContent />
//     </AuthGuard>
//   )
// }
