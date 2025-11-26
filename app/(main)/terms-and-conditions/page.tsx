import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Syarat dan Ketentuan
          </h1>
          <p className="text-gray-600">
            Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Penerimaan Ketentuan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Dengan mengakses dan menggunakan platform e-commerce ini, Anda
                menyetujui untuk terikat oleh syarat dan ketentuan yang berlaku.
                Jika Anda tidak setuju dengan salah satu bagian dari ketentuan
                ini, mohon untuk tidak menggunakan layanan kami.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Pendaftaran Akun
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Untuk menggunakan layanan tertentu, Anda harus membuat akun
                  dengan memberikan informasi yang akurat dan lengkap.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi
                  </li>
                  <li>
                    Anda bertanggung jawab atas semua aktivitas yang terjadi di
                    akun Anda
                  </li>
                  <li>
                    Anda harus segera memberi tahu kami tentang penggunaan akun
                    yang tidak sah
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Pemesanan dan Pembayaran
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>Dengan melakukan pemesanan, Anda menyatakan bahwa:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Anda memiliki hak legal untuk menggunakan metode pembayaran
                    yang dipilih
                  </li>
                  <li>Informasi yang Anda berikan adalah benar dan lengkap</li>
                  <li>Anda memahami bahwa harga dapat berubah sewaktu-waktu</li>
                  <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                </ul>
                <p className="mt-3">
                  Kami berhak menolak atau membatalkan pesanan jika terdapat
                  indikasi penipuan atau pelanggaran ketentuan.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Pengiriman
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>Ketentuan pengiriman:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Estimasi waktu pengiriman adalah perkiraan dan tidak dijamin
                  </li>
                  <li>
                    Kami tidak bertanggung jawab atas keterlambatan yang
                    disebabkan oleh pihak ketiga
                  </li>
                  <li>
                    Pastikan alamat pengiriman yang Anda berikan benar dan
                    lengkap
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Kebijakan Pengembalian
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Anda dapat mengembalikan produk dalam waktu 30 hari sejak
                  penerimaan dengan ketentuan:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Produk dalam kondisi asli dan tidak digunakan</li>
                  <li>Kemasan dan label masih utuh</li>
                  <li>Disertai bukti pembelian yang sah</li>
                  <li>Pengembalian dana akan diproses dalam 7-14 hari kerja</li>
                </ul>
                <p className="mt-3">
                  Produk yang tidak dapat dikembalikan: produk yang sudah
                  dibuka, produk digital, dan produk custom/pesanan khusus.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Hak Kekayaan Intelektual
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Seluruh konten di platform ini, termasuk teks, grafis, logo,
                gambar, dan perangkat lunak adalah milik kami atau pemberi
                lisensi kami dan dilindungi oleh undang-undang hak cipta. Anda
                tidak diperbolehkan untuk menyalin, memodifikasi, atau
                mendistribusikan konten tanpa izin tertulis.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Privasi Data
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami menghormati privasi Anda dan berkomitmen untuk melindungi
                data pribadi Anda. Informasi yang kami kumpulkan digunakan untuk
                memproses pesanan, meningkatkan layanan, dan komunikasi terkait
                pesanan. Kami tidak akan membagikan data Anda kepada pihak
                ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Pembatasan Tanggung Jawab
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>Kami tidak bertanggung jawab atas:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kerugian tidak langsung atau konsekuensial</li>
                  <li>Kehilangan data atau kerusakan sistem</li>
                  <li>Gangguan layanan yang berada di luar kendali kami</li>
                  <li>
                    Kesalahan atau keterlambatan dalam pemrosesan pembayaran
                    pihak ketiga
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Perilaku Pengguna
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>Anda setuju untuk tidak:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Menggunakan platform untuk aktivitas ilegal</li>
                  <li>Mengganggu atau merusak layanan</li>
                  <li>Mengakses akun pengguna lain tanpa izin</li>
                  <li>Mengirimkan virus atau kode berbahaya</li>
                  <li>
                    Melakukan penipuan atau penyalahgunaan sistem pembayaran
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Perubahan Ketentuan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami berhak untuk mengubah syarat dan ketentuan ini
                sewaktu-waktu. Perubahan akan berlaku segera setelah
                dipublikasikan di platform. Penggunaan berkelanjutan atas
                layanan kami setelah perubahan dianggap sebagai penerimaan
                terhadap ketentuan yang diperbarui.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Hukum yang Berlaku
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai
                dengan hukum Republik Indonesia. Setiap sengketa yang timbul
                akan diselesaikan di pengadilan yang berwenang di Indonesia.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Hubungi Kami
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Jika Anda memiliki pertanyaan tentang syarat dan ketentuan
                  ini, silakan hubungi kami:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p>
                    <strong>Email:</strong> zaidhusni93@gmail.com
                  </p>
                  {/* <p>
                    <strong>Telepon:</strong> +62 21 1234 5678
                  </p> */}
                  <p>
                    <strong>Alamat:</strong> Jl. Jawar No. 54 Wonosobo,
                    Indonesia
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Dengan menggunakan platform ini, Anda menyatakan telah membaca,
                memahami, dan menyetujui seluruh syarat dan ketentuan yang
                berlaku.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
