import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/fonts.css";
import { NotificationProvider } from "@/components/NotificationContext";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "GES Show Workbench",
  description: "A Next.js app with Tailwind CSS and shadcn/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
