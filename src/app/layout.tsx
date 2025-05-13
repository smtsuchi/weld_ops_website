import './globals.css'
import '@fontsource/oswald/700.css';
import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import theme from '@/theme'
const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "Weld Ops",
  description: "Weld Ops is a platform for welding professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={`${inter.className} test-style`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 bg-gray-50">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
