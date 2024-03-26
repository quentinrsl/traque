import { Inter } from "next/font/google";
import "./globals.css";
import SocketProvider from "@/context/socketContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "La Traque",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SocketProvider>
        <body className={inter.className + " h-screen"}>{children}</body>
      </SocketProvider>
    </html>
  );
}
