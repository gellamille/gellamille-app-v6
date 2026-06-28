import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gellamille működési rendszer",
  description: "Gyártás, készlet, rendelés, szállítás és pénzügyi követés.",
  icons: {
    icon: [{ url: "/icon.svg?v=20260628-g", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg?v=20260628-g", type: "image/svg+xml" }]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
