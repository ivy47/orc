import { ThemeProvider } from "@orc/web/components/theme-provider";
import { Toaster } from "@orc/web/ui/magicui/ui/sonner";
import { cn } from "@orc/web/ui/magicui/lib/utils";
import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from "next/font/google";
import { ThemeToggle } from '@orc/web/components/theme-toggle';
import { TailwindIndicator } from '@orc/web/components/tailwind-indicator';
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Magic UI",
  description: "The startup template from Magic UI",
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: 'black' },
    { media: '(prefers-color-scheme: light)', color: 'white' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem={false}
        >
          {children}
          <Toaster />
          <ThemeToggle />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
