import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-black/[0.04] dark:bg-grid-white/[0.03] bg-size-[20px_20px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 
          bg-neutral-100/40 dark:bg-white/5 
          backdrop-blur-sm rounded-full text-sm font-medium mb-6 
          border border-neutral-300/40 dark:border-white/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-500 dark:bg-neutral-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-700 dark:bg-neutral-100"></span>
            </span>
            Produk Baru Telah Tersedia!
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Temukan Pengalaman
            <span className="block text-neutral-900 dark:text-neutral-50">
              Berbelanja yang Sempurna
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            Jelajahi koleksi produk kami yang luas dan nikmati penawaran
            eksklusif hanya untuk Anda.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/products">
              <Button
                size="lg"
                className="w-full sm:w-auto 
              bg-neutral-900 text-neutral-50 hover:bg-neutral-800 
              dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Belanja Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto 
              border-neutral-300 text-neutral-700 hover:bg-neutral-100 
              dark:border-white/20 dark:text-neutral-200 
              dark:hover:bg-white/5 backdrop-blur-sm"
              >
                <Search className="mr-2 h-5 w-5" />
                Jelajahi Kategori
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-8 text-sm text-neutral-600 dark:text-neutral-400">
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                1.000+
              </div>
              <div>Pelanggan Puas</div>
            </div>
            <div className="h-12 w-px bg-neutral-300 dark:bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                5.000+
              </div>
              <div>Produk Terjual</div>
            </div>
            <div className="h-12 w-px bg-neutral-300 dark:bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                4.8/5
              </div>
              <div>Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
