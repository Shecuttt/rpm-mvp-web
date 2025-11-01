import Link from "next/link";
import { Facebook, Instagram, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-black text-slate-300 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-white text-2xl font-bold mb-4 flex">
              <Image
                src="/rpm-header.png"
                width={30}
                height={30}
                alt="RPM Store"
                className="invert"
              />
              Store
            </div>
            <p className="text-sm leading-relaxed">
              Your destination for quality products. We bring you the best
              selection of fashion, electronics, and lifestyle items at
              competitive prices.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Free Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Easy Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <p className="text-sm mb-4">
              Follow us on social media for updates and exclusive offers
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className=" p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className=" p-2 rounded-full hover:bg-pink-500 hover:text-black transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className=" p-2 rounded-full hover:bg-green-700 transition-colors"
              >
                <Phone className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Ragil Putra Mandiri. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
