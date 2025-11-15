import SignupForm from "@/components/auth/signup/signup-form";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Sign Up | RPM - Ragil Putra Mandiri",
  description: "Platform e-commerce terpercaya di Indonesia",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect;

  return (
    <div className="min-h-screen flex items-center justify-center py-4">
      <Card className="p-6 w-full max-w-md rounded-none md:rounded-2xl border-none md:border-2 shadow-none md:shadow-lg">
        <CardTitle className="text-2xl font-bold text-center capitalize">
          sign up
        </CardTitle>
        <SignupForm redirectTo={redirectTo} />
        <CardFooter className="text-sm mx-auto text-muted-foreground">
          Already have an account?
          <Link
            href={redirectTo ? `/login?redirect=${redirectTo}` : "/login"}
            className="text-primary font-medium hover:underline ml-1"
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
