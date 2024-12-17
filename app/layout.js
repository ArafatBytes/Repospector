import { Jost } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const jost = Jost({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Repospector",
  description: "A web app for Civil Engineers",
};

//${geistSans.variable} ${geistMono.variable}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jost.className} antialiased bg-[#fafafa]`}>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
