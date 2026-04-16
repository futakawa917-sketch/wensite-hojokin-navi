import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { siteConfig } from "../../site.config";
import { Header } from "@/components/Header";
import { FloatingCTA } from "@/components/FloatingCTA";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: GSC_VERIFICATION ? { google: GSC_VERIFICATION } : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${notoSerifJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-noto-sans-jp)] pb-14 md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#0a1f3d] text-white py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div>
                <p className="font-black text-lg">{siteConfig.name}</p>
                <p className="mt-3 text-sm text-gray-400">{siteConfig.footer.companyName}</p>
                <p className="text-sm text-gray-500 mt-1">{siteConfig.footer.address}</p>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                {siteConfig.nav.map((item) => (
                  <a key={item.href} href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </a>
                ))}
                <a href="/company" className="text-gray-400 hover:text-white transition-colors">運営者情報</a>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">プライバシーポリシー</a>
                <a href="/law" className="text-gray-400 hover:text-white transition-colors">特定商取引法に基づく表記</a>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <a href={`tel:${siteConfig.cta.phone}`} className="text-gray-400 hover:text-white transition-colors">
                  {siteConfig.cta.phone}
                </a>
                <a href={`mailto:${siteConfig.cta.email}`} className="text-gray-400 hover:text-white transition-colors">
                  メールでのご相談
                </a>
                <a href={siteConfig.cta.lineUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  LINEでのご相談
                </a>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} {siteConfig.footer.companyName} All Rights Reserved.
            </div>
          </div>
        </footer>
        <FloatingCTA />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {CLARITY_ID && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
