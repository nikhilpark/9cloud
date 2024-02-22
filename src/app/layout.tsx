import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@/components/AppBar';
import theme from '@/theme';
import "./globals.css"
export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
          <UserProvider>

      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <AppBar/>
            {props.children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
      </UserProvider>

    </html>
  );
}