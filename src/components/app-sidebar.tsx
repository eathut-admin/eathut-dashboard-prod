"use client";

import * as React from "react";
import {
  HandPlatter,
  LocateFixed,
  Users,
  Truck,
  Wallet,
  LayoutDashboard,
  Salad,
  HandCoins,
  ChartNoAxesCombined,
  BadgeCheck,
  Building2,
  Shield,
  GalleryVerticalEnd,
  PackagePlus,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavPages } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "Eathut Admin Panel",
      logo: "/logo/eathut_logo.jpeg",
      industry: "Delivery",
    },
  ],
  navMain: [
    {
      title: "Restaurant Panel",
      url: "#",
      icon: HandPlatter,
      isActive: true,
      items: [
        {
          title: "Restaurant Panel",
          url: "/restaurant/restaurant-panel",
        },
        {
          title: "Orders",
          url: "/restaurant/orders",
        },
      ],
    },
    {
      title: "Tracking",
      url: "#",
      icon: LocateFixed,
      items: [
        {
          title: "Track by Order Id",
          url: "/order-track/track-single-order",
        },
        {
          title: "Track Multiple Order Ids",
          url: "/order-track/track-multiple-order",
        },
      ],
    },
    {
      title: "Customer Panel",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/customer/customer-panel",
        },
        {
          title: "Coupons",
          url: "/customer/coupon",
        },
        {
          title: "Offers",
          url: "/customer/offer",
        },
      ],
    },
    {
      title: "Delivery Boy Panel",
      url: "#",
      icon: Truck,
      items: [
        {
          title: "All Delivery Agents",
          url: "/delivery-agent/all-rider",
        },
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: Wallet,
      items: [
        {
          title: "Cash Collection",
          url: "/payment/cash-collection",
        },
        {
          title: "Cash Deposit",
          url: "/payment/cash-deposit",
        },
      ],
    },
    {
      title: "Verify",
      url: "#",
      icon: BadgeCheck,
      items: [
        {
          title: "Restaurant Verification",
          url: "/restaurant/verify-restaurant",
        },
        {
          title: "Delivery Agent Verification",
          url: "/delivery-agent/verify-rider",
        },
      ],
    },
  ],
  pages: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Food (Add, Remove & Edit)",
      url: "/food/add-food",
      icon: Salad,
    },
    {
      name: "Food Categories",
      url: "/food/categories",
      icon: PackagePlus,
    },
    {
      name: "Money Withdrawal Requests",
      url: "/payment/money-withdrawal-request",
      icon: HandCoins,
    },
    {
      name: "All Admins",
      url: "/admin",
      icon: Shield,
    },
    {
      name: "All Hubs",
      url: "/hubs",
      icon: Building2,
    },
    {
      name: "Banners",
      url: "/banners",
      icon: GalleryVerticalEnd,
    },
    {
      name: "Sales Graph",
      url: "/sales-graph",
      icon: ChartNoAxesCombined,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavPages pages={data.pages} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
