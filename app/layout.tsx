import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../src/index.css";

export const metadata: Metadata = {
  title: "EduCore — La plateforme éducative qui s’adapte à vous",
  description:
    "Une plateforme de gestion éducative pensée pour les écoles, groupes scolaires et universités.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
