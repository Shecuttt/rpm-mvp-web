/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signupSchema, SignupType } from "@/utils/zod/auth-schema";
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

export default function SignupForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const form = useForm<SignupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupType) => {
    setLoading(true);

    try {
      //submit data to supabase
      const { data: signupData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });
      if (error) throw error;

      // insert manually to profile table
      if (signupData.user) {
        const { error: profileError } = await supabase.from("profile").insert([
          {
            id: signupData.user.id,
            name: data.name,
            email: data.email,
          },
        ]);
        // Ignore error kalo profile udah ada (dari trigger)
        if (profileError && !profileError.message.includes("duplicate")) {
          console.error("Profile creation error:", profileError);
        }
      }

      toast.success("Signup berhasil!");
      router.push(redirectTo || "/account");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat signup.");
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
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  {...form.register("name")}
                  disabled={loading}
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>
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
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  {...form.register("confirmPassword")}
                  disabled={loading}
                />
                {form.formState.errors.confirmPassword && (
                  <FieldError>
                    {form.formState.errors.confirmPassword.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? <Spinner /> : "Sign Up"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
