import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accès Refusé",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
