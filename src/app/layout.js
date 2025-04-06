import { AuthProvider } from "@/context/authContext";
// import { Geist, Geist_Mono } from "next/font/google";
import { crimson } from "./fonts";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "SecondsToGo",
  description: "Combatting food waste since Wildhacks 2025.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

        <body
          className={`${crimson.variable} antialiased`}
        >
          <AuthProvider>
          {children}
          </AuthProvider>
        </body>

    </html>
  );
}
