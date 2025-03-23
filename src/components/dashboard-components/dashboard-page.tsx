"use client";

import { FaUserPlus } from "react-icons/fa";
import CreateAdminDialog from "./create-admin-dialog";
import { Button } from "../ui/button";
import CallDashboardCardApi from "./call-dashboard-card-api";
import Link from "next/link";
import { useUserRole } from "@/context/user-role-context";
import { useEffect, useState } from "react";
import { UserProfilePageProps } from "../user-profile-page-components/user-profile-page";
import { GetCurrentUserData } from "@/actions/GetCurrentUserData.action";
import DailyOrdersLiveReportComponent from "./daily-orders-live-report-component";
import TotalOrdersReportWithMonthYearComponent from "./total-orders-report-with-month-year-component";
import DailyRiderLiveReportComponent from "./daily-rider-live-report-component";

const DashboardPageComp = () => {
  const [currentUserData, setCurrentUserData] =
    useState<UserProfilePageProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useUserRole();

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

  return (
    <main>
      <div className="grid lg:grid-cols-2 items-center mt-10 lg:mb-14">
        <div>
          <h1 className="firaSans font-semibold text-[25px] md:text-[30px] flex items-center gap-2">
            Welcome back,{" "}
            {loading ? (
              <span className="animate-pulse bg-gray-300 rounded-md w-32 h-6 translate-y-0.5"></span>
            ) : error ? (
              "😵😵😵"
            ) : (
              currentUserData?.name || "😵😵😵"
            )}
          </h1>
          <p className="text-[12px] md:text-[14px]">
            You are logged in as{" "}
            {loading ? (
              <span className="animate-pulse bg-gray-300 rounded-md w-20 h-4 inline-block translate-y-1"></span>
            ) : error ? (
              <span className="text-xs font-bold">😵😵😵</span>
            ) : currentUserData?.role ? (
              <span className="text-[#fcac1c]">
                {currentUserData.role.toLowerCase()}
              </span>
            ) : (
              <span className="text-xs font-bold">😵😵😵</span>
            )}
          </p>
        </div>
        <div className="flex flex-row gap-3 lg:justify-self-end justify-between sm:justify-normal my-8 lg:my-0">
          {userRole === "SUPER-ADMIN" && (
            <div className="place-self-center justify-self-end">
              <CreateAdminDialog>
                <Button variant="default" className="h-[50px] px-5 w-full">
                  <span className="mr-0.5 text-xl">
                    <FaUserPlus />
                  </span>
                  <span className="font-semibold">Create New Admin</span>
                </Button>
              </CreateAdminDialog>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <CallDashboardCardApi />
        <hr className="my-5 w-[80%] m-auto bg-black dark:bg-white outline-none h-0.5" />
        <div className="w-[80%] m-auto grid grid-cols-2 gap-4">
          <Link href="/restaurant/verify-restaurant">
            <Button className="w-full h-12 md:h-16 font-semibold">
              Verify Restaurant
            </Button>
          </Link>
          <Link href="/delivery-agent/verify-rider">
            <Button className="w-full h-12 md:h-16 font-semibold">
              Verify Rider
            </Button>
          </Link>
        </div>
        <hr className="mt-5 w-[40%] m-auto bg-black dark:bg-white outline-none h-0.5" />
        <hr className="w-[20%] m-auto bg-black dark:bg-white outline-none h-0.5" />

        <div className="min-h-[100vh] flex-1 rounded-xl bg-white md:min-h-min"></div>
      </div>

      {/* Main Section ------------------------ */}

      <section className="grid 2xl:grid-cols-2 gap-10 mt-14">
        <DailyOrdersLiveReportComponent
          currentUserData={{
            role: userRole,
            adminId: currentUserData?._id || "",
            name: currentUserData?.name || "",
          }}
        />

        <TotalOrdersReportWithMonthYearComponent
          currentUserData={{
            role: userRole,
            adminId: currentUserData?._id || "",
            name: currentUserData?.name || "",
          }}
        />

        <div className="2xl:col-span-2">
          {userRole === "ADMIN" && <DailyRiderLiveReportComponent />}
        </div>
      </section>
    </main>
  );
};

export default DashboardPageComp;
