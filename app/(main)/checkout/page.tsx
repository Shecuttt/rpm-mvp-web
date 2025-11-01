import { redirect } from "next/navigation";

export default function CheckoutRootPage() {
  // Redirect ke halaman produk
  redirect("/products");
}
