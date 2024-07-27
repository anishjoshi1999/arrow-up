import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arrow Up",
  description:
    "Arrow Up is an exciting and challenging typing game where players must quickly press the correct arrow keys as they appear on the screen. Test your reflexes, improve your typing speed, and compete for high scores in this fun and addictive game!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
