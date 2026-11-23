import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Канадын химийн инженерийн ёс зүй — кейс шинжилгээ",
  description: "Mount Polley-ийн жишээгээр Канадын инженерийн ёс зүйг шинжлэх нь",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body>{children}</body></html>;
}
