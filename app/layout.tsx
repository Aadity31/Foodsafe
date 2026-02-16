import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { SessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: {
    default: "FoodSafe - Real-Time Event Food Rescue Network",
    template: "%s | FoodSafe",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  description: "Connect event hosts with verified NGOs to rescue surplus food and fight hunger while reducing food waste. Join FoodSafe to save meals and help those in need.",
  keywords: ["food rescue", "food donation", "NGO", "food waste", "surplus food", "hunger", "food redistribution", "event food", "food bank", "community feeding"],
  authors: [{ name: "FoodSafe" }],
  creator: "FoodSafe",
  publisher: "FoodSafe",
  metadataBase: new URL("https://foodsafe.org"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foodsafe.org",
    siteName: "FoodSafe",
    title: "FoodSafe - Real-Time Event Food Rescue Network",
    description: "Connect event hosts with verified NGOs to rescue surplus food and fight hunger while reducing food waste.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodSafe - Rescue Surplus Food, Fight Hunger",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodSafe - Real-Time Event Food Rescue Network",
    description: "Connect event hosts with verified NGOs to rescue surplus food and fight hunger while reducing food waste.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background font-sans">
        <SessionProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="py-6 px-4 md:px-6 border-t">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 FoodSafe. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Fighting hunger, reducing waste.
              </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
