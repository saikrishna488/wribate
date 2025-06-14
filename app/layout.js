// import { Source_Serif_Pro } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./Provider";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Render from './components/Render'
import Footer from './components/Footer'
import { Source_Serif_4 } from 'next/font/google';
import GoogleAnalytics from './../lib/GoogleAnalytics'
import { Suspense } from 'react';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-source-serif',
});

export const metadata = {
  title: "Wribate",
  description: "Where Ideas Meet Words.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sourceSerif.variable} antialiased`}
      >
        <Toaster />

        <div className="h-full w-full flex flex-row">
          <Sidebar />
          
          <ReduxProvider>
            <div className="bg-white w-full h-[90%]">
              <Render />
              <Navbar />
              <Suspense >
                <GoogleAnalytics/>
              </Suspense>
              
              {children}
              
            </div>
          </ReduxProvider>
        </div>

      </body>
    </html>
  );
}
