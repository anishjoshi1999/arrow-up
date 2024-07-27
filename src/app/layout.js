import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arrow Up",
  description:
    "Arrow Up is an exciting and challenging typing game where players must quickly press the correct arrow keys as they appear on the screen. Test your reflexes, improve your typing speed, and compete for high scores in this fun and addictive game!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
