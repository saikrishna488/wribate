import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./Provider";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Render from './components/Render'
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Wribate",
  description: "Where Ideas Meet Words.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >


        <Toaster />

        <Navbar />
        <div className="h-full w-full flex flex-row">
          <Sidebar />

          <ReduxProvider>
            <div className="bg-white overflow-auto w-full h-[90%]">
              <Render />
              {children}
            </div>
          </ReduxProvider>
        </div>

      </body>
    </html>
  );
}
