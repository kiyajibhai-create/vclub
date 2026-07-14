import '../globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VClub',
  description: 'VClub - Members Area',
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Roboto:wght@400;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
