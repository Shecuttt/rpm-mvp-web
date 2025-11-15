/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { loginSchema, LoginType } from "@/utils/zod/auth-schema";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeClosed } from "lucide-react";
import GoogleSignInButton from "../google-signin";

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginType) => {
    setLoading(true);

    try {
      //submit data to supabase
      const { data: loginData, error } = await supabase.auth.signInWithPassword(
        {
          email: data.email,
          password: data.password,
        }
      );
      if (error) throw error;

      toast.success(`Selamat datang, ${loginData.user?.user_metadata.name}`);
      router.push(redirectTo || "/account");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            {/* Form fields will go here */}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                  disabled={loading}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    {...form.register("password")}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size={"icon-sm"}
                    onClick={toggleShowPassword}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>

                {form.formState.errors.password && (
                  <FieldError>
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? <Spinner /> : "Sign In"}
            </Button>
          </Field>
          <Field>
            <GoogleSignInButton redirectTo={redirectTo} />
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
