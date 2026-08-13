import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { AppChrome } from "@/components/layout/AppChrome";
import { SITE } from "@/lib/utils/categories";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["books", "library", "open library", "gutenberg", "authors", "free ebooks"],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${plusJakarta.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
