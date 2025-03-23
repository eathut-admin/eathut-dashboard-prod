"use client";

import { BadgeCheck, ChevronsUpDown, LogOut, Headset } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogoutUser } from "@/actions/Logout.action";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserProfilePageProps } from "./user-profile-page-components/user-profile-page";
import { GetCurrentUserData } from "@/actions/GetCurrentUserData.action";
import TextLoadingAnimation from "./loading-animations/Text-loading-animation";

export function NavUser() {
  const [logoutAlertOpen, setLogoutAlertOpen] = useState<boolean>(false);
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [currentUserData, setCurrentUserData] =
    useState<UserProfilePageProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await GetCurrentUserData();

        if (response.statusCode === 200 && response.success) {
          setCurrentUserData(response.data);
        } else {
          setError(response.error);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    setLogoutAlertOpen(false);
    try {
      const response = await LogoutUser();

      if (response.success) {
        toast.success("Logged out successfully!");
        router.push("/");
      } else {
        toast.error("Failed to log out!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLogoutAlertOpen(false);
    }
  };

  return (
    <div>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src="/profile/admin-profile.jpg"
                    alt={currentUserData?.name}
                    className="object-cover object-top"
                  />
                  <AvatarFallback className="rounded-lg">PP</AvatarFallback>
                </Avatar>
                <div
                  className={`grid flex-1 text-left text-sm leading-tight ${
                    loading ? "space-y-1" : "space-y-0"
                  }`}>
                  <span className="truncate font-semibold">
                    {loading ? (
                      <TextLoadingAnimation height="2.5" width="24" />
                    ) : (
                      currentUserData?.name
                    )}
                  </span>
                  <span className="truncate text-xs">
                    {loading ? (
                      <TextLoadingAnimation height="2.5" width="36" />
                    ) : (
                      currentUserData?.email
                    )}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-sm lg:translate-x-[18px]"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="/profile/admin-profile.jpg"
                      alt={currentUserData?.name}
                      className="object-cover object-top"
                    />
                    <AvatarFallback className="rounded-lg">PP</AvatarFallback>
                  </Avatar>
                  <div
                    className={`grid flex-1 text-left text-sm leading-tight ${
                      loading ? "space-y-1" : "space-y-0"
                    }`}>
                    <span className="truncate font-semibold">
                      {loading && !error ? (
                        <TextLoadingAnimation height="2.5" width="24" />
                      ) : (
                        currentUserData?.name
                      )}
                    </span>
                    <span className="truncate text-xs">
                      {loading ? (
                        <TextLoadingAnimation height="2.5" width="36" />
                      ) : (
                        currentUserData?.email
                      )}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/account/user-profile">
                  <DropdownMenuItem className={cn("cursor-pointer")}>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                </Link>
                <Link href="/account/contact-us">
                  <DropdownMenuItem className={cn("cursor-pointer")}>
                    <Headset />
                    Contact Us
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={cn("cursor-pointer")}
                onClick={() => setLogoutAlertOpen(true)}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
        <Toaster richColors />
      </SidebarMenu>

      {logoutAlertOpen && (
        <AlertDialog open={logoutAlertOpen} onOpenChange={setLogoutAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will log you out.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setLogoutAlertOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
