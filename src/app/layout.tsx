import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chat Assistant",
  description: "A powerful AI chat assistant powered by OpenAI",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        {children}
      </body>
    </html>
  );
}
