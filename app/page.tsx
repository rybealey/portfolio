import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageLoader from "@/components/PageLoader";

export default function Home() {
  return (
    <>
      <PageLoader />
      <main id="main-content" className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Full width image with caption */}
      <div className="w-full md:w-1/2 relative h-[50vh] md:h-screen group overflow-hidden">
        <Image
          src="/portfolio-image.webp"
          alt="Samuel J. Chapman (left), Ry Bealey, Ahna Quichocho, Whitney Buchanan (right) at Apple Holiday Party in Austin, TX 2024"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
          quality={80}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none px-2 sm:px-4">
          <div className="bg-white dark:bg-gray-900 px-3 py-2 rounded-full shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none">
            <p className="text-[8px] md:text-[9px] font-normal text-gray-900 dark:text-gray-100 leading-relaxed whitespace-normal sm:whitespace-nowrap text-center">
              Samuel J. Chapman (left), Ry Bealey, Ahna Quichocho, Whitney Buchanan (right);  Holiday Party at Austin, TX 2024.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Title and biography */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-0 bg-background" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        <div className="mb-6 md:mb-8" style={{ paddingBottom: '0.5rem', overflow: 'visible' }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-0 overflow-visible break-words" style={{ lineHeight: '1.4', paddingBottom: '0.75rem', paddingTop: '0.25rem' }}>
            <span className="bg-gradient-to-r from-[#738678] via-[#a67a5f] to-[#5e6a61] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]" style={{ fontFamily: "'Two Sugars', sans-serif", display: 'inline-block', paddingBottom: '0.125rem' }}>Howdy, partner! </span><span> 🤠</span>
          </h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
          Multifaceted tech and design professional with over seven years of experience crafting user-centric solutions across server administration, front and back-end development, and website design. At Apple, I serve as a technical support advisor and product specialist, empowering customers to unlock the full potential of their devices while helping them discover the perfect tools for their next adventure.
        </p>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mt-4">
          At SERVERIZZ, I design and develop visually compelling websites, administer server infrastructure, and execute inbound marketing strategies for clients across diverse industries. I&apos;ve also contributed to Impeccabyte by building a full-fledged web application that facilitates entity formation, management, and digital payment through helpful partnerships and collaboration with services like <a href="https://www.bizee.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 focus-visible-ring transition-colors">Bizee<span className="sr-only"> (opens in new tab)</span></a>, <a href="https://www.maverickpayments.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 focus-visible-ring transition-colors">Maverick Payments<span className="sr-only"> (opens in new tab)</span></a>, <a href="https://www.checkhq.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 focus-visible-ring transition-colors">CheckHQ<span className="sr-only"> (opens in new tab)</span></a>, and <a href="https://bridge.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 focus-visible-ring transition-colors">Bridge<span className="sr-only"> (opens in new tab)</span></a>.
        </p>
        <nav className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4" aria-label="Main navigation">
          <Link 
            href="/resume" 
            className="inline-flex items-center gap-1 text-sm md:text-base font-normal text-foreground underline hover:text-blue-600 focus-visible-ring rounded transition-colors min-h-[44px] min-w-[44px] px-2 -ml-2"
          >
            Résumé
            <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
          </Link>
          <Link 
            href="/case-studies" 
            className="inline-flex items-center gap-1 text-sm md:text-base font-normal text-foreground underline hover:text-blue-600 focus-visible-ring rounded transition-colors min-h-[44px] min-w-[44px] px-2"
          >
            Case Studies
            <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </main>
    </>
  );
}
