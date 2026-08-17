import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tastefield.com"),
  title: "Tastefield — your design system, enforced as the AI types",
  description:
    "Tastefield compiles the design system already in your repo into rules your coding agent has to follow, served over a local MCP server. No telemetry, no account, nothing leaves your machine.",
  openGraph: {
    title: "Tastefield — your design system, enforced as the AI types",
    description:
      "Compiles your real tokens and component contracts into rules Cursor, Claude Code and Windsurf have to follow — then checks the output before it reaches your diff.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
