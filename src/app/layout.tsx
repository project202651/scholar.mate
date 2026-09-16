import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#0b1220",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://scholarmate-beryl.vercel.app"),
  title: {
    default: "ScholarMate | AI Exam Preparation & Syllabus Intelligence",
    template: "%s | ScholarMate",
  },
  description:
    "AI-powered exam preparation workspace for university and engineering students. Master 3-Mark, 7-Mark, and 10-Mark questions with Nexa AI tutor, active recall flashcards, and simulated mock exams.",
  keywords: [
    "ScholarMate",
    "Nexa AI",
    "Exam Preparation",
    "Engineering Exam Prep",
    "Active Recall",
    "Spaced Repetition",
    "3-Mark questions",
    "7-Mark questions",
    "10-Mark derivations",
    "Mock Exam Simulator",
    "Syllabus Intelligence",
  ],
  authors: [{ name: "ScholarMate Team (AANM & VVRSR Polytechnic)" }],
  creator: "ScholarMate AI",
  publisher: "ScholarMate",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scholarmate-beryl.vercel.app",
    title: "ScholarMate | AI Exam Preparation System",
    description:
      "Transform syllabus notes and past question papers into actionable study roadmaps, 3M/7M/10M marking rubrics, and diagnostic mock exams.",
    siteName: "ScholarMate",
    images: [
      {
        url: "/images/scholarmate-3d-core.jpg",
        width: 1200,
        height: 630,
        alt: "ScholarMate AI Exam Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScholarMate | AI Exam Preparation System",
    description:
      "Transform syllabus notes and past question papers into actionable study roadmaps, 3M/7M/10M marking rubrics, and diagnostic mock exams.",
    images: ["/images/scholarmate-3d-core.jpg"],
    creator: "@scholarmate_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ScholarMate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
