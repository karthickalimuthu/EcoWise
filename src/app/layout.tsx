import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoWise AI — Carbon Footprint Awareness Platform",
  description:
    "Understand, track, and reduce your carbon footprint with AI-powered insights, personalized recommendations, and sustainability challenges.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "CO2 tracker",
    "eco-friendly",
    "climate action",
    "carbon calculator",
  ],
  authors: [{ name: "EcoWise AI" }],
  openGraph: {
    title: "EcoWise AI — Carbon Footprint Tracker",
    description:
      "AI-powered platform to understand and reduce your environmental impact.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
