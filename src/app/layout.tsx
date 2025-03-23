import type { Metadata } from "next";
import { Roboto_Condensed, Lobster } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import UserRoleProviderWrapper from "@/context/user-role-provider-wrapper";
import { cookies } from "next/headers";
import UnderMaintenanceComponent from "@/components/under-maintenance-component";

const roboto_Condensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const lobster = Lobster({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lobster",
});

export const metadata: Metadata = {
  title: "Eathut Admin Panel",
  description:
    "Manage orders, restaurants, deliveries, and user accounts with the Eathut Admin Panel. Streamline your food delivery operations effortlessly.",
  keywords: [
    "food delivery",
    "admin panel",
    "order management",
    "restaurant management",
    "delivery tracking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const role = cookieStore.get("role")?.value || "";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto_Condensed.className} ${lobster.variable} antialiased`}>
        <UnderMaintenanceComponent>
          <UserRoleProviderWrapper userRole={role}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </UserRoleProviderWrapper>
        </UnderMaintenanceComponent>
        <Toaster richColors />
      </body>
    </html>
  );
}
