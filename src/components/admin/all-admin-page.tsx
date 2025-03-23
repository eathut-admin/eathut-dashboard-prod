"use client";

import { useEffect, useState } from "react";
import { AllAdminPageColumns } from "@/app/data-table-components/admin/Admin-page-column";
import { AllAdminPageDataTable } from "@/app/data-table-components/admin/Admin-page-data-table";
import { Shield } from "lucide-react";
import { GetAllAdmin } from "@/actions/auth-admin/GetAllAdmin.action";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import ErrorAnimation from "../loading-animations/Error-animation";
import { DeleteAdmin } from "@/actions/auth-admin/DeleteAdmin.action";
import { toast } from "sonner";

const AllAdminPageComp = () => {
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoadingDelete, setButtonLoadingDelete] = useState<
    Record<string, boolean>
  >({});
  // const [buttonLoadingBlock, setButtonLoadingBlock] = useState<
  //   Record<string, boolean>
  // >({});

  const handleDelete = async (adminId: string) => {
    setButtonLoadingDelete((prev) => ({ ...prev, [adminId]: true }));
    try {
      const result = await DeleteAdmin(adminId);
      if (result) {
        setData((prevData: any) =>
          prevData.filter((admin: any) => admin.adminId !== adminId)
        );
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDelete((prev) => ({ ...prev, [adminId]: false }));
    }
  };

  // const handleBlock = async (adminId: string) => {
  //   setButtonLoadingBlock((prev) => ({ ...prev, [adminId]: true }));
  //   try {
  //     const result = await (adminId);
  //     if (result) {
  //       setData((prevData: any) =>
  //         prevData.filter((admin: any) => admin.adminId !== adminId)
  //       );
  //       toast.success(result.message);
  //     } else {
  //       throw new Error(result.error);
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setButtonLoadingBlock((prev) => ({ ...prev, [adminId]: false }));
  //   }
  //   console.log("Admin Id : ", adminId);
  // };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await GetAllAdmin();

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
    <main className="min-h-full">
      <div className="flex justify-center items-center gap-8 mt-10">
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
        <Shield className="text-lg shrink-0 grow" />
        <h1 className="text-2xl font-extrabold shrink-0 grow">
          All Admin List
        </h1>
        <Shield className="text-lg shrink-0 grow" />
        <div className="w-full space-y-1">
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
          <hr className="bg-black dark:bg-white outline-none h-0.5" />
        </div>
      </div>

      <div className="mt-14">
        {loading ? (
          <TableLoadingAnimation />
        ) : (
          <AllAdminPageDataTable
            data={data ? data : []}
            columns={AllAdminPageColumns({
              handleDelete,
              // handleBlock,
              buttonLoadingDelete,
              // buttonLoadingBlock,
            })}
          />
        )}
      </div>
    </main>
  );
};

export default AllAdminPageComp;
