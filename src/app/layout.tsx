'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';


import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import ResponsiveAppBar from './_Components/navbar/page';

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}> 
        
        <body className={inter.className}>
        <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>

          {children}
          </ThemeProvider>

          </AppRouterCacheProvider>

          </body>
      </Provider>
    </html>
  );
}
