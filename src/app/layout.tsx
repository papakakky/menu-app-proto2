import type { Metadata, Viewport } from "next";
import "./globals.css";

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
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
