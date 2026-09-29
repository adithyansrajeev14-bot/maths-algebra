import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Linear Algebra Revision Sheet',
  description: 'Everything from your notes: solving systems, vector spaces, LU, eigenvalues, and quadratic forms with interactive practice and tutorial questions.',
  openGraph: {
    title: 'Linear Algebra Revision Sheet',
    description: 'Everything from your notes: solving systems, vector spaces, LU, eigenvalues, and quadratic forms with interactive practice and tutorial questions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linear Algebra Revision Sheet',
    description: 'Everything from your notes: solving systems, vector spaces, LU, eigenvalues, and quadratic forms with interactive practice and tutorial questions.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}


