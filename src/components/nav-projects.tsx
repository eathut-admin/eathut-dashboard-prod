"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserRole } from "@/context/user-role-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavPages({
  pages,
}: {
  pages: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { userRole } = useUserRole();
  const pathname = usePathname();

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {pages.map((item) => {
          if (
            (item.name === "All Admins" ||
              item.name === "Sales Graph" ||
              item.name === "All Hubs") &&
            userRole !== "SUPER-ADMIN"
          ) {
            return null;
          }

          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={cn(isActive && "bg-accent text-accent-foreground")}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
