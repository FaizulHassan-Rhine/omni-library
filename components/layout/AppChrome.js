"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function AppChrome({ children }) {
  const pathname = usePathname();
  const isReader = pathname.startsWith("/read/");

  return (
    <>
      {isReader ? null : <Navbar />}
      <main className="flex-1">{children}</main>
      {isReader ? null : <Footer />}
    </>
  );
}
