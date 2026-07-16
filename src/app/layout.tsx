import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://vclub.sh'),
  title: {
    default: 'VClub | Official VClub Members Area & Login',
    template: '%s | VClub Official'
  },
  description: 'Welcome to the official VClub members area. Secure login, register, and restore access to the premier VClub forum and community portal.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  keywords: [
    'vclub', 'vclub.sh', 'vclub login', 'vclub register', 'vclub official',
    'vclub.one', 'vclub mirror', 'vclub forum', 'vclub shop', 'vclub carding',
    'vclub alternative', 'vclub website', 'vclub domains', 'ccshop', 'cc', 'carding', 'cc shop', 'carding shop', 'carding dumps', 'carding forum',
  ],
  authors: [{ name: 'VClub' }],
  creator: 'VClub',
  publisher: 'VClub',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://vclub.sh',
  },
  openGraph: {
    title: 'VClub | Official VClub Members Area & Login',
    description: 'Welcome to the official VClub members area. Secure login, register, and restore access to the premier VClub forum and community portal.',
    url: 'https://vclub.sh',
    siteName: 'VClub Official',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VClub | Official VClub Members Area & Login',
    description: 'Welcome to the official VClub members area. Secure login, register, and restore access to the premier VClub forum and community portal.',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
