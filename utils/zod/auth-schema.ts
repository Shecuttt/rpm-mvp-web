import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nama harus memiliki setidaknya 3 karakter." }),
    email: z.email({ message: "Format email tidak valid." }),
    password: z
      .string()
      .min(8, { message: "Password harus memiliki setidaknya 8 karakter." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Konfirmasi password harus diisi." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // Pesan ini akan ditargetkan ke field 'confirmPassword'
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["confirmPassword"], // Menentukan field mana yang akan menampilkan error
  });

// Mengekstrak tipe TypeScript dari skema Zod
export type SignupType = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email({
    message: "Format email tidak valid.",
  }),
  password: z
    .string()
    .min(8, { message: "Password harus memiliki setidaknya 8 karakter." }),
});

export type LoginType = z.infer<typeof loginSchema>;
