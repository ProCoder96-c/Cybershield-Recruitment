import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import CyberBackground from "@/components/public/CyberBackground";
import GlassGlare from "@/components/public/GlassGlare";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberShield Recruitment",
  description:
    "Join CyberShield. See the open positions, meet the team and apply online.",
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CyberBackground />
        <GlassGlare />
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
