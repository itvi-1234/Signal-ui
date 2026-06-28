import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureChat",
  description: "Signal Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} h-screen flex flex-col overflow-hidden bg-signal-bg-dark text-signal-text-primary`}>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
