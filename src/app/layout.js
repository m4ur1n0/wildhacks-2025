import { AuthProvider } from "@/context/authContext";
import { crimson } from "./fonts";
import "./globals.css";
import "@/styles/scrollbar.css";

export const metadata = {
  title: "SecondsToGo",
  description: "Combatting food waste since Wildhacks 2025.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${crimson.variable} font-serif`}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}