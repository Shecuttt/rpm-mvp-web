import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-black/[0.04] dark:bg-grid-white/[0.03] bg-size-[20px_20px]" />

      {/* Modern Decorations (Blobs) */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse delay-700 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-32">
        <div className="max-w-3xl relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 
          bg-neutral-100/40 dark:bg-white/5 
          backdrop-blur-sm rounded-full text-sm font-medium mb-8 
          border border-neutral-300/40 dark:border-white/10 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-500 dark:bg-neutral-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-700 dark:bg-neutral-100"></span>
            </span>
            <span className="bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent font-semibold">
              Produk Baru Telah Tersedia!
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Temukan Pengalaman
            <span className="block bg-linear-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-white bg-clip-text text-transparent">
              Berbelanja yang Sempurna
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed max-w-2xl">
            Jelajahi koleksi produk kami yang luas dan nikmati penawaran
            eksklusif hanya untuk Anda.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/products">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base
              bg-neutral-900 text-neutral-50 hover:bg-neutral-800 
              dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-neutral-500/20 dark:shadow-white/10"
              >
                Belanja Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base
              border-neutral-300 text-neutral-700 hover:bg-neutral-100 
              dark:border-white/20 dark:text-neutral-200 
              dark:hover:bg-white/5 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
              >
                <Search className="mr-2 h-5 w-5" />
                Jelajahi Kategori
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
