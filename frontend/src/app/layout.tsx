import { Inter, Epilogue } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });
const epilogue = Epilogue({ subsets: ["latin"] });

export const metadata = {
  title: "VeriFlow - Verifiable AI Data Marketplace",
  description: "VeriFlow is the first verifiable AI training data marketplace on Filecoin with cryptographic proofs and USDFC payments.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={epilogue.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
