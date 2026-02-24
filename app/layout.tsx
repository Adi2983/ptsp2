import type {Metadata} from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PTSP Digital MTsN 2 Kotawaringin Timur',
  description: 'Sistem Pelayanan Terpadu Satu Pintu (PTSP) Digital untuk MTsN 2 Kotawaringin Timur',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
