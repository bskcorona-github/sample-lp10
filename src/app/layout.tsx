import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "美容サロン | 心と体のリラクゼーション",
  description:
    "プロのエステティシャンによる高品質なフェイシャル、ヘッドスパ、ボディマッサージを提供する美容サロン",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-rose-600 hover:text-rose-700 transition"
            >
              BeautySalon
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li className="text-gray-700 hover:text-rose-500 transition">
                  <a href="#services">サービス</a>
                </li>
                <li className="text-gray-700 hover:text-rose-500 transition">
                  <a href="#reservation">予約</a>
                </li>
                <li className="text-gray-700 hover:text-rose-500 transition">
                  <a href="#faq">よくある質問</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:justify-between">
              <div className="mb-8 md:mb-0">
                <Link href="/" className="inline-block">
                  <h2 className="text-xl font-bold text-rose-600 mb-2 hover:text-rose-700 transition">
                    BeautySalon
                  </h2>
                </Link>
                <p className="text-gray-600 max-w-md mt-4">
                  心と体の調和を大切にする美容サロン。お客様一人ひとりに合わせたトリートメントで、理想の美しさをサポートします。
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  コンタクト
                </h3>
                <div className="mt-4 text-gray-600">
                  <p>東京都渋谷区〇〇町 1-2-3</p>
                  <p>TEL: 03-1234-5678</p>
                  <p>営業時間: 10:00〜19:00 (火曜定休)</p>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} BeautySalon. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
