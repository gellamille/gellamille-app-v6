import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gellamille működési rendszer",
  description: "Gyártás, készlet, rendelés, szállítás és pénzügyi követés."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
