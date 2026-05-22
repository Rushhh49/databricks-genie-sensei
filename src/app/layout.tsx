import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Analytics Copilot",
  description: "Premium AI-native analytics copilot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-background text-foreground antialiased`}
      >
        <div className="relative min-h-screen overflow-hidden">
          {/* Soft Gradient Background */}
          <div className="fixed inset-0 -z-10 h-full w-full bg-background">
            <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(235,94,40,0.15),rgba(255,255,255,0))]"></div>
            <div className="absolute bottom-[-10%] right-[-20%] top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(235,94,40,0.15),rgba(255,255,255,0))]"></div>
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}