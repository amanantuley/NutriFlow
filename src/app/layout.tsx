
import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nutriflow.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NutriFlow | Clinical-Grade Culinary Discovery',
    template: '%s | NutriFlow',
  },
  description: 'NutriFlow precisely matches local culinary options to your specific daily biometric profiles and macronutrient targets.',
  applicationName: 'NutriFlow',
  category: 'health tech',
  keywords: ['health tracking', 'macros', 'culinary', 'AI recommendations', 'premium food'],
  openGraph: {
    type: 'website',
    title: 'NutriFlow | Clinical-Grade Culinary Discovery',
    description: 'Elevate your performance with perfectly matched macros.',
    siteName: 'NutriFlow',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriFlow | Clinical-Grade Culinary Discovery',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
