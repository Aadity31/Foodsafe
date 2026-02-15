import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { SessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "SurplusLink - Real-Time Event Food Rescue Network",
  description: "Connect event hosts with verified NGOs to rescue surplus food and fight hunger while reducing food waste.",
  keywords: ["food rescue", "food donation", "NGO", "food waste", "surplus food", "hunger"],
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
                © 2024 SurplusLink. All rights reserved.
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
