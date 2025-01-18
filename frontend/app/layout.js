import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "UOV EXAMINATION",
  description: "UOV EXAMINATION PORTAL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased bg-zinc-100 h-screen overflow-hidden`}
      >
        <ReactQueryProvider>
          <Header />
          <div className="pt-20 h-full w-full overflow-y-scroll">
            {children}
          </div>
          <Toaster />
          <ReactQueryDevtools />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
