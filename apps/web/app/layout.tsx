import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/** Display face. WONK/SOFT give it old-style character at poster sizes. */
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const diatype = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "./fonts/ABCDiatype-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ABCDiatype-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ABCDiatype-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tastefield.com"),
  title: "Tastefield: the brand and taste layer for agents",
  description:
    "Tastefield compiles the design system already in your repo into rules your coding agent has to follow, served over a local MCP server. No telemetry, no account, nothing leaves your machine.",
  openGraph: {
    title: "Tastefield: the brand and taste layer for agents",
    description:
      "Compiles your real tokens and component contracts into rules Claude Code, Codex, and Cursor have to follow. Then checks the output before it reaches your diff.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${diatype.variable} ${fraunces.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
