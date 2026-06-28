import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gellamille működési rendszer",
  description: "Gyártás, készlet, rendelés, szállítás és pénzügyi követés.",
  icons: {
    icon: [
      { url: "/icon.svg?v=20260628-g2", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=20260628-g2", sizes: "32x32", type: "image/png" }
    ],
    shortcut: [{ url: "/favicon.ico?v=20260628-g2" }],
    apple: [{ url: "/apple-touch-icon.png?v=20260628-g2", sizes: "180x180", type: "image/png" }]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
