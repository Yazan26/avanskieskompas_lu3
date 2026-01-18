import type { Metadata } from 'next';
import './globals.css';
import { Lexend } from 'next/font/google';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Providers } from '../components/providers/Providers';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Avans Keuze Kompas - Find your perfect Elective Module with AI',
  description:
    'Stop endlessly searching. Get personal recommendations based on your interests and studies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* Material Symbols - using swap to ensure icons always render */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body
        className={`${lexend.className} min-h-screen bg-background-light text-text-primary-light dark:bg-background-dark dark:text-text-primary-dark`}
      >
        <Providers>
          {/* Full-screen column layout */}
          <div className="flex min-h-screen flex-col">
            {/* Navbar full width */}
            <Navbar />

            {/* Main content - now full width, pages control their own containers */}
            <main className="flex-1 w-full">
              {children}
            </main>

            {/* Footer full width */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}


