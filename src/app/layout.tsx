import type { Metadata, Viewport } from "next";
import { Zen_Kaku_Gothic_New, Yomogi } from "next/font/google";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
});

const yomogi = Yomogi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-yomogi",
});

export const metadata: Metadata = {
  title: "献立コンシェルジュ",
  description: "夕方の家事負担を極限まで減らす、考えるゼロの献立アプリ",
};

export const viewport: Viewport = {
  themeColor: "#E63946",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenKaku.variable} ${yomogi.variable}`}>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
