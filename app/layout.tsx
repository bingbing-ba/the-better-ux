import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Link from 'next/link';
import { Github } from 'lucide-react';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'The Better UX',
  description: 'The Better UX from software engineers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen">
            {children}
            <footer className="mt-16 border-t py-6 text-sm text-gray-600">
              <div className="mx-auto flex max-w-4xl items-center justify-end gap-2 px-6">
                <Github className="h-4 w-4" />
                <Link
                  href="https://github.com/bingbing-ba/the-better-ux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-800"
                >
                  Github
                </Link>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
