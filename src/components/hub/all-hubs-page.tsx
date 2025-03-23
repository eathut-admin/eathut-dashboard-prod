"use client";

import { useEffect, useState } from "react";
import { AllHubPageColumns } from "@/app/data-table-components/hub/Hub-page-column";
import { AllHubPageDataTable } from "@/app/data-table-components/hub/Hub-page-data-table";
import { Building2 } from "lucide-react";
import { GetAllHubLinkedWithAdminDetails } from "@/actions/hub/GetAllHubLinkedWithAdminDetails.action";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import ErrorAnimation from "../loading-animations/Error-animation";
import { DeleteAdmin } from "@/actions/auth-admin/DeleteAdmin.action";
import { toast } from "sonner";

const AllHubsPageComp = () => {
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoadingDelete, setButtonLoadingDelete] = useState<
    Record<string, boolean>
  >({});

  const handleDelete = async (hub_id: string) => {
    setButtonLoadingDelete((prev) => ({ ...prev, [hub_id]: true }));
    try {
      const result = await DeleteAdmin(hub_id);
      if (result) {
        setData((prevData: any) =>
          prevData.filter((hub: any) => hub.hub_id !== hub_id)
        );
        toast.success(result.massage);
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDelete((prev) => ({ ...prev, [hub_id]: false }));
    }
  };

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      try {
        const result = await GetAllHubLinkedWithAdminDetails();

        if (result.statusCode === 200 && result.success) {
          setData(result.data);
        } else {
          setError(result.message);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

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
    <main>
      <div className="flex justify-center items-center gap-8 mt-10">
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
        <Building2 className="text-lg shrink-0 grow" />
        <h1 className="text-2xl font-extrabold shrink-0 grow">All Hub List</h1>
        <Building2 className="text-lg shrink-0 grow" />
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
      </div>

      <div className="mt-14">
        {loading ? (
          <TableLoadingAnimation />
        ) : (
          <AllHubPageDataTable
            data={data ? data : []}
            columns={AllHubPageColumns({
              handleDelete,
              buttonLoadingDelete,
            })}
          />
        )}
      </div>
    </main>
  );
};

export default AllHubsPageComp;
