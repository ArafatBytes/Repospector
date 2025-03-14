import { Jost } from "next/font/google";
import "./globals.css";
import "./styles/print.css";
import { Toaster } from "react-hot-toast";

const jost = Jost({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Repospector",
  description: "A web app for Civil Engineers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jost.className} antialiased bg-[#fafafa]`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
