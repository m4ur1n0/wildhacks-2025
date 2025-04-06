import { AuthProvider } from "@/context/authContext";
import "./globals.css";

const fontClasses = "font-sans antialiased";

export const metadata = {
  title: "SecondsToGo",
  description: "Combatting food waste since Wildhacks 2025.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

        <body
          className={fontClasses}
        >
          <AuthProvider>
          {children}
          </AuthProvider>
        </body>

    </html>
  );
}
