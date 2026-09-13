import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Instrument_Sans } from "next/font/google";
import { SITE } from "@/data/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const DESCRIPTION =
  "Told there's a long waiting period on the car you want? Tell THE CAR-BAR what you're looking for. We check availability across our authorised seller network and help coordinate the next step — subject to availability.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "THE CAR-BAR — No waiting on your dream car",
    template: "%s · THE CAR-BAR",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "car without waiting period",
    "car availability India",
    "Fortuner waiting period",
    "Innova Crysta waiting period",
    "Innova Hycross waiting period",
    "Mahindra car availability",
    "car availability Maharashtra",
    "authorised car seller network",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: "THE CAR-BAR — No waiting on your dream car",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "THE CAR-BAR — No waiting on your dream car",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/** No aggregateRating or Review — there is no real data behind either (CLAUDE.md §2). */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      slogan: SITE.proposition,
      logo: `${SITE.url}/brand/logo.png`,
      sameAs: [SITE.instagram],
      areaServed: { "@type": "Country", name: "India" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en-IN",
    },
    {
      "@type": "Service",
      "@id": `${SITE.url}/#service`,
      name: "Car arrangement service",
      serviceType: "Car arrangement and authorised seller coordination",
      provider: { "@id": `${SITE.url}/#organization` },
      areaServed: { "@type": "Country", name: "India" },
      description:
        "THE CAR-BAR takes a buyer's car requirement, checks availability across its authorised seller network, and coordinates the connection. The purchase is completed directly with the authorised seller.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body
        className={`${bricolage.variable} ${instrument.variable} ${geistMono.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
