// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
// ИСПОЛЬЗУЕМ ОТНОСИТЕЛЬНЫЙ ПУТЬ
import { Gatekeeper } from "./components/Gatekeeper"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Фабрика Контента",
  description: "Ваш центр управления AI-инфлюенсером",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Gatekeeper>
          <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex gap-6 font-semibold">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                🗂️ Доска
              </Link>
              <Link href="/calendar" className="text-gray-700 hover:text-blue-600">
                🗓️ Календарь
              </Link>
            </div>
          </nav>
          <main>
            {children}
          </main>
        </Gatekeeper>
      </body>
    </html>
  );
}
