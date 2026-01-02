import Link from "next/link";
import { Facebook, Instagram, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-neutral-900 text-neutral-50 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-10 mb-8">
          <div className="md:col-span-3">
            <div className="text-neutral-50 text-2xl font-bold mb-4 flex items-center">
              <Image
                src="/rpm-header.png"
                width={30}
                height={30}
                alt="RPM Store"
                className="invert mr-2 w-auto h-auto"
              />
              Store
            </div>
            {/* Description only on desktop for simpler mobile view */}
            <p className="hidden md:block text-sm leading-relaxed text-neutral-400">
              RPM Store adalah platform e-commerce yang menyediakan berbagai
              produk berkualitas dengan harga terbaik. Kami berkomitmen untuk
              memberikan pengalaman belanja online yang mudah, aman, dan
              menyenangkan bagi pelanggan kami.
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-neutral-50 font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-neutral-50 transition-colors hover:underline"
                >
                  Syarat dan Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-neutral-50 font-semibold mb-4">
              Terhubung dengan Kami
            </h4>
            <p className="text-sm mb-4 text-neutral-400">
              Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan
              atau masalah.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="bg-neutral-800 p-2 rounded-full hover:bg-blue-700 hover:text-white text-neutral-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-neutral-800 p-2 rounded-full hover:bg-pink-600 hover:text-white text-neutral-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-neutral-800 p-2 rounded-full hover:bg-green-600 hover:text-white text-neutral-400 transition-colors"
              >
                <Phone className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-neutral-500 pt-8 border-t border-neutral-800">
          <p>
            &copy; {new Date().getFullYear()} Ragil Putra Mandiri. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
