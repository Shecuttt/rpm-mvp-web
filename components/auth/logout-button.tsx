"use client";

import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { signOut } from "@/lib/action/auth";

type LogoutButtonProps = {
  variant?: "destructive" | "text";
};

export default function LogoutButton({
  variant = "destructive",
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
    });

    toast.success("Logout berhasil");
  };

  const trigger =
    variant === "destructive" ? (
      <Button variant="destructive" className="cursor-pointer hover:bg-red-500">
        {isPending ? "Logging out..." : "Logout"}
      </Button>
    ) : (
      <Button variant={"ghost"} className="w-full text-red-500">
        {isPending ? "Logging out..." : "Logout"}
      </Button>
    );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin mau logout?</AlertDialogTitle>
          <AlertDialogDescription>
            Nanti syahadat lagi yah :D
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Gajadi</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            {isPending ? "Logging out..." : "Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
