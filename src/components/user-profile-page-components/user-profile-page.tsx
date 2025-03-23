"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import TextLoadingAnimation from "../loading-animations/Text-loading-animation";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
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
import { LogoutUser } from "@/actions/Logout.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import ErrorAnimation from "../loading-animations/Error-animation";
import { GetCurrentUserData } from "@/actions/GetCurrentUserData.action";
import ChangePasswordDialogComponent from "./change-password-dialog-component";
import { MdOutlineChangeCircle } from "react-icons/md";
import { MdLockReset } from "react-icons/md";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { ResetPassword } from "@/actions/auth-admin/ResetPassword.action";
import AllotedRestaurantsSectionComponent from "./alloted-restaurants-section-component";
import { GetAllRestaurantDetails } from "@/actions/restaurant/RestaurantDetails.action";
import CardLoadingAnimation from "../loading-animations/profile-page-card-loading-animation";

export interface UserProfilePageProps {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  allotedRestaurants: [];
  userId: string;
  role: string;
}

const UserProfilePageComp = () => {
  const [data, setData] = useState<UserProfilePageProps>();
  const [allotedRestaurants, setAllotedRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logoutAlertOpen, setLogoutAlertOpen] = useState<boolean>(false);
  const [restPasswordLoading, setRestPasswordLoading] =
    useState<boolean>(false);
  const router = useRouter();

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

  const handleResetPassword = async () => {
    setRestPasswordLoading(true);
    try {
      const response = await ResetPassword(data?.email || "");

      if (response.message && response.error) {
        toast.error(response.message);
      } else if (response.message && !response.error) {
        toast.success(response.message);
      } else {
        toast.error(response.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRestPasswordLoading(false);
    }
  };

  const handleCopyUserId = () => {
    const userId = data?.userId;
    navigator.clipboard
      .writeText(userId || "")
      .then(() => {
        toast.success("User ID copied to clipboard!", {
          position: "top-center",
        });
      })
      .catch(() => {
        toast.error("Failed to copy User ID!", { position: "top-center" });
      });
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [response, restaurantResponse] = await Promise.all([
          GetCurrentUserData(),
          GetAllRestaurantDetails(),
        ]);

        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error);
        }

        if (restaurantResponse.success) {
          setAllotedRestaurants(restaurantResponse.data);
        } else {
          setError(restaurantResponse.error);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full text-sm">
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-end px-3 ">
        <Link href="https://appariumnewapp.vercel.app/" target="_blank">
          <span className="hidden md:block ml-2 mt-2 text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Created and Developed by{" "}
            <strong className="text-black dark:text-white">Supranostik</strong>,
            2025
          </span>
        </Link>
      </div>

      <div className="mt-14 relative">
        <div className="container h-[13rem] md:h-[20rem] overflow-hidden rounded-md relative min-w-full"></div>
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full absolute -bottom-11 md:-bottom-14 left-5 bg-red-800 z-50 aspect-square overflow-hidden">
          <Image
            src="/profile/admin-profile.jpg"
            alt="user"
            width={100}
            height={100}
            className="w-full h-full aspect-square object-cover object-top"></Image>
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-5 text-base">
        <ChangePasswordDialogComponent>
          <Button
            className="h-11 bg-gray-50 dark:bg-transparent dark:hover:bg-[#161616]"
            variant="outline">
            <MdOutlineChangeCircle />
            Change Password
          </Button>
        </ChangePasswordDialogComponent>
        <Button className="h-11" onClick={handleResetPassword}>
          {restPasswordLoading ? (
            <ButtonLoadingAnimation text="Sending email..." />
          ) : (
            <>
              <MdLockReset />
              Reset Password
            </>
          )}
        </Button>
        <Button
          onClick={() => setLogoutAlertOpen(true)}
          size="icon"
          title="Click to logout"
          variant="destructive">
          <LogOut className="text-sm" />
        </Button>
      </div>

      <section className="mt-12 flex items-center gap-5">
        <div className="h-11 border-2 rounded-md px-4 text-sm flex items-center gap-4 w-[533px] cursor-not-allowed">
          <FaUser />
          {loading ? (
            <TextLoadingAnimation height="4" width="36" />
          ) : (
            <span>{data?.userId}</span>
          )}
        </div>
        <Button
          className="h-11 w-28 border-2"
          variant="outline"
          title="Click to copy user id"
          onClick={handleCopyUserId}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </Button>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-y-4 xl:gap-x-4 mt-5 pb-10">
        {loading ? (
          <CardLoadingAnimation />
        ) : (
          <div className="h-full border-2 rounded-md p-10 relative flex flex-col justify-center gap-3">
            {/* Role Badge */}
            <div className="absolute top-2 right-4">
              <span className="absolute top-2 right-4 text-xs font-semibold bg-yellow-500 px-3 py-0.5 rounded-full text-black w-28 text-center">
                {data?.role}
              </span>
            </div>

            {/* Name */}
            <span className="flex items-center gap-4">
              <span className="text-xl">👤</span>
              <span className="light:text-gray-800">{data?.name}</span>
            </span>

            {/* Email */}
            <span className="flex items-center gap-4">
              <span className="text-xl">📧</span>
              <span className="light:text-gray-800">{data?.email}</span>
            </span>

            {/* Address */}
            <span className="flex items-start gap-4">
              <span className="text-xl">📍</span>
              <div className="flex-1">
                <div className="space-y-2 light:text-gray-800">
                  {/* Street */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏠</span>
                    <span className="font-medium">Street:</span>
                    <span>{data?.address?.street}</span>
                  </div>

                  {/* Area */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏢</span>
                    <span className="font-medium">Area:</span>
                    <span>{data?.address?.area}</span>
                  </div>

                  {/* City */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌆</span>
                    <span className="font-medium">City:</span>
                    <span>{data?.address?.city}</span>
                  </div>

                  {/* State */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌍</span>
                    <span className="font-medium">State:</span>
                    <span>{data?.address?.state}</span>
                  </div>

                  {/* Pincode */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📮</span>
                    <span className="font-medium">Pincode:</span>
                    <span>{data?.address?.pincode}</span>
                  </div>
                </div>
              </div>
            </span>
          </div>
        )}

        <AllotedRestaurantsSectionComponent data={allotedRestaurants} />
      </section>

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
    </main>
  );
};

export default UserProfilePageComp;
