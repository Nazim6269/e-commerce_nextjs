import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buyly - E-commerce Store",
  description: "Your one-stop shop for the best products online",
  openGraph: {
    title: "Buyly - E-commerce Store",
    description: "Your one-stop shop for the best products online",
    type: "website",
  },
};

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <NextTopLoader color="#F35C7A" showSpinner={false} />
            <Navbar />
            {children}
            <Toaster position="bottom-right" />
            <Footer />
            <BackToTop />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
