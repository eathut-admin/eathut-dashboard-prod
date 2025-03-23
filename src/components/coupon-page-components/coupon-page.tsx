"use client";

import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { CouponPageDataTable } from "@/app/data-table-components/coupon-page/Coupon-page-data-table";
import { CouponPageColumns } from "@/app/data-table-components/coupon-page/Coupon-page-column";
import { toast } from "sonner";
import { DeleteCoupon } from "@/actions/coupon/DeleteCoupon.action";
import AddNewCouponSheetComponent from "./add-new-coupon-sheet-component";
import { useUserRole } from "@/context/user-role-context";
import { FcCancel } from "react-icons/fc";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GetAllActiveCouponData } from "@/actions/coupon/GetAllActiveCoupon.action";
import { GetAllInactiveCouponData } from "@/actions/coupon/GetAllInactiveCoupon.action";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { ToggleCouponStatus } from "@/actions/coupon/ToggleCouponStatus.action";
import ErrorAnimation from "../loading-animations/Error-animation";

const CouponPageComp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState<string>("Active Coupons");
  const [buttonLoadingDelete, setButtonLoadingDelete] = useState<
    Record<string, boolean>
  >({});
  const [buttonLoadingDeactivate, setButtonLoadingDeactivate] = useState<
    Record<string, boolean>
  >({});
  const [allActiveCoupons, setAllActiveCoupons] = useState<any[]>([]);
  const [allInactiveCoupons, setAllInactiveCoupons] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useUserRole();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTable === "Active Coupons") {
          const allActiveCouponsResponse = await GetAllActiveCouponData();
          if (
            allActiveCouponsResponse &&
            (allActiveCouponsResponse.statusCode === 200 ||
              allActiveCouponsResponse.success)
          ) {
            setAllActiveCoupons(allActiveCouponsResponse.data);
          }
        } else if (activeTable === "Inactive Coupons") {
          const allInactiveCouponsResponse = await GetAllInactiveCouponData();
          if (
            allInactiveCouponsResponse &&
            (allInactiveCouponsResponse.statusCode === 200 ||
              allInactiveCouponsResponse.success)
          ) {
            setAllInactiveCoupons(allInactiveCouponsResponse.data);
          }
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTable]);

  const handleDelete = async (couponId: string) => {
    setButtonLoadingDelete((prev) => ({ ...prev, [couponId]: true }));
    try {
      const result = await DeleteCoupon(couponId);
      if (result.success) {
        if (activeTable === "Active Coupons") {
          setAllActiveCoupons((prevData) =>
            prevData.filter((coupon) => coupon._id !== couponId)
          );
        } else if (activeTable === "Inactive Coupons") {
          setAllInactiveCoupons((prevData) =>
            prevData.filter((coupon) => coupon._id !== couponId)
          );
        }
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDelete((prev) => ({ ...prev, [couponId]: false }));
    }
  };

  const handleDeactivate = async (couponId: string, status: boolean) => {
    setButtonLoadingDeactivate((prev) => ({ ...prev, [couponId]: true }));
    try {
      const result = await ToggleCouponStatus(couponId);

      if (result.statusCode === 200 && result.success) {
        if (status) {
          setAllInactiveCoupons((prev) => [
            ...prev,
            ...allActiveCoupons.filter((item) => item._id === couponId),
          ]);
          setAllActiveCoupons((prev) =>
            prev.filter((item) => item._id !== couponId)
          );
        } else {
          setAllActiveCoupons((prev) => [
            ...prev,
            ...allInactiveCoupons.filter((item) => item._id === couponId),
          ]);
          setAllInactiveCoupons((prev) =>
            prev.filter((item) => item._id !== couponId)
          );
        }

        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDeactivate((prev) => ({ ...prev, [couponId]: false }));
    }
  };

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      <div className="grid lg:grid-cols-2 gap-5 mt-14">
        <Button
          variant="default"
          disabled={activeTable === "Active Coupons"}
          className={`px-3 h-12 ${
            activeTable === "Active Coupons" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("Active Coupons")}>
          {/* <CiDeliveryTruck /> */}
          Active Coupons
        </Button>
        <Button
          variant="default"
          disabled={activeTable === "Inactive Coupons"}
          className={`px-3 h-12 ${
            activeTable === "Inactive Coupons" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("Inactive Coupons")}>
          {/* <TbTruckOff /> */}
          Inactive Coupons
        </Button>
      </div>

      <div className="my-10 grid place-items-center">
        {userRole === "SUPER-ADMIN" ? (
          <AddNewCouponSheetComponent>
            <Button className="w-72 max-w-96 h-12 text-[#0d0d0d] bg-[#fcac1c] hover:bg-[#fcac1c]/90">
              Add New Coupon
            </Button>
          </AddNewCouponSheetComponent>
        ) : (
          <Alert className="max-w-96 mx-auto">
            <FcCancel className="h-4 w-4" />
            <AlertTitle>Sorry, admin.</AlertTitle>
            <AlertDescription>
              You don&apos;t have permission to add a new coupon.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <hr className="mt-10 w-[70%] m-auto bg-black dark:bg-white outline-none h-0.5" />
      <hr className="mt-8 w-[40%] m-auto bg-black dark:bg-white outline-none h-0.5" />

      <div className="mt-20">
        {activeTable === "Active Coupons" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <CouponPageDataTable
                data={allActiveCoupons ? allActiveCoupons : []}
                columns={CouponPageColumns({
                  handleDelete,
                  handleDeactivate,
                  buttonLoadingDelete,
                  buttonLoadingDeactivate,
                  userRole,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "Inactive Coupons" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <CouponPageDataTable
                data={allInactiveCoupons ? allInactiveCoupons : []}
                columns={CouponPageColumns({
                  handleDelete,
                  handleDeactivate,
                  buttonLoadingDelete,
                  buttonLoadingDeactivate,
                  userRole,
                })}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CouponPageComp;
