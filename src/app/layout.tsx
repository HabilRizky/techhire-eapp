import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechHire | Portal Lowongan Kerja D3 TI",
  description:
    "Platform E-Recruitment & E-Portofolio khusus mahasiswa D3 Teknik Informatika untuk menemukan pekerjaan impian dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
