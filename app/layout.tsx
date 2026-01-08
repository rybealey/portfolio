import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationMenu } from "@/components/NavigationMenu";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap", // Optimize font loading for better performance
});

export const metadata: Metadata = {
  title: "Ry Bealey · Private Grotto",
  description: "My portfolio website",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ry Bealey · Private Grotto",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
                } else {
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', systemPrefersDark);
                }
              })();
            `,
          }}
        />
        <NavigationMenu />
        {children}
      </body>
    </html>
  );
}

