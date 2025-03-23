"use client";

import { Button } from "../ui/button";
import AddNewBannerDialogComponent from "./add-new-banner-dialog-component";
import BannerImageSliderWithDeleteButton from "./banner-image-slider-with-delete-button";
import { GetAllBannerData } from "@/actions/banner/GetAllBanner.action";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { useEffect, useState } from "react";
import { AllBannerPageColumns } from "@/app/data-table-components/banner/All-banner-page-column";
import { AllBannerPageDataTable } from "@/app/data-table-components/banner/All-banner-page-data-table";
import ErrorAnimation from "../loading-animations/Error-animation";
import { toast } from "sonner";
import { DeleteBanner } from "@/actions/banner/DeleteBanner.action";
import { ToggleBannerStatus } from "@/actions/banner/ToggleBannerStatus.action";
import { GetAllDeactivatedBanner } from "@/actions/banner/GetAllDeactivatedBanner.action";

const BannerPageComp = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonLoadingDelete, setButtonLoadingDelete] = useState<
    Record<string, boolean>
  >({});
  const [buttonLoadingDeactivate, setButtonLoadingDeactivate] = useState<
    Record<string, boolean>
  >({});
  const [activeTable, setActiveTable] = useState<string>("All Banners");
  const [allBannerData, setAllBannerData] = useState<any[]>([]);
  const [allDeactivateBannerData, setAllDeactivateBannerData] = useState<any[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [allBannerResponse, allDeactivateBannerResponse] =
          await Promise.all([GetAllBannerData(), GetAllDeactivatedBanner()]);

        if (
          allBannerResponse &&
          allBannerResponse.statusCode === 200 &&
          allBannerResponse.success
        ) {
          setAllBannerData(allBannerResponse.data);
        } else {
          setError(allBannerResponse.message);
        }
        if (
          allDeactivateBannerResponse &&
          allDeactivateBannerResponse.statusCode === 200 &&
          allDeactivateBannerResponse.success
        ) {
          setAllDeactivateBannerData(allDeactivateBannerResponse.data);
        } else {
          setError(allDeactivateBannerResponse.message);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (banner_id: string) => {
    setButtonLoadingDelete((prev) => ({ ...prev, [banner_id]: true }));
    try {
      const result = await DeleteBanner(banner_id);
      if (result.statusCode === 200 && result.success) {
        setAllBannerData((prev) =>
          prev.filter((item) => item._id !== banner_id)
        );
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDelete((prev) => ({ ...prev, [banner_id]: false }));
    }
  };

  const handleDeactivate = async (banner_id: string, status: boolean) => {
    setButtonLoadingDeactivate((prev) => ({ ...prev, [banner_id]: true }));
    try {
      const result = await ToggleBannerStatus(
        banner_id,
        status ? "DEACTIVATE" : "ACTIVATE"
      );

      if (result.statusCode === 200 && result.success) {
        if (status) {
          setAllDeactivateBannerData((prev) => [
            ...prev,
            ...allBannerData.filter((item) => item._id === banner_id),
          ]);
          setAllBannerData((prev) =>
            prev.filter((item) => item._id !== banner_id)
          );
        } else {
          setAllBannerData((prev) => [
            ...prev,
            ...allDeactivateBannerData.filter((item) => item._id === banner_id),
          ]);
          setAllDeactivateBannerData((prev) =>
            prev.filter((item) => item._id !== banner_id)
          );
        }

        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDeactivate((prev) => ({ ...prev, [banner_id]: false }));
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
          disabled={activeTable === "All Banners"}
          className={`px-3 h-12 ${
            activeTable === "All Banners"
          } ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("All Banners")}>
          {/* <CiDeliveryTruck /> */}
          All Banners
        </Button>
        <Button
          variant="default"
          disabled={activeTable === "Deactivated Banners"}
          className={`px-3 h-12 ${
            activeTable === "Deactivated Banners"
          } ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("Deactivated Banners")}>
          {/* <TbTruckOff /> */}
          Deactivated Banners
        </Button>
      </div>

      <div className="my-10 grid place-items-center">
        <AddNewBannerDialogComponent>
          <Button className="w-72 max-w-96 h-12 text-[#0d0d0d] bg-[#fcac1c] hover:bg-[#fcac1c]/90">
            Add New Banner
          </Button>
        </AddNewBannerDialogComponent>
      </div>

      <div className="mt-7">
        {activeTable === "All Banners" ? (
          <BannerImageSliderWithDeleteButton
            slides={allBannerData ? allBannerData : []}
            loading={loading}
          />
        ) : (
          <BannerImageSliderWithDeleteButton
            slides={allDeactivateBannerData ? allDeactivateBannerData : []}
            loading={loading}
          />
        )}
      </div>

      <div className="mt-20">
        {activeTable === "All Banners" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <AllBannerPageDataTable
                data={allBannerData ? allBannerData : []}
                columns={AllBannerPageColumns({
                  handleDelete,
                  handleDeactivate,
                  buttonLoadingDelete,
                  buttonLoadingDeactivate,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "Deactivated Banners" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <AllBannerPageDataTable
                data={allDeactivateBannerData ? allDeactivateBannerData : []}
                columns={AllBannerPageColumns({
                  handleDelete,
                  handleDeactivate,
                  buttonLoadingDelete,
                  buttonLoadingDeactivate,
                })}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default BannerPageComp;
