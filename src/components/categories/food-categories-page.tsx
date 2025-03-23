"use client";

import AddNewCategoryDialog from "@/components/categories/add-new-category";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { CategoryPageDataTable } from "@/app/data-table-components/categories/Categories-page-data-table";
import { CategoryPageColumns } from "@/app/data-table-components/categories/Categories-page-column";
import { GetAllCategory } from "@/actions/category/GetAllCategory.action";
import ErrorAnimation from "../loading-animations/Error-animation";
import { GetAllDeactivatedCategory } from "@/actions/category/GetAllDeactivatedCategoty.action";
import { ToggleCategoryStatus } from "@/actions/category/ToggleCategoryStatus.action";
import { toast } from "sonner";
import { DeleteCategory } from "@/actions/category/DeleteCategory.action";

const FoodCategoriesPageComp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState<string>("All Categories");
  const [error, setError] = useState<string | null>(null);
  const [allCategoryData, setAllCategoryData] = useState<any[]>([]);
  const [allDeactivatedCategoryData, setAllDeactivatedCategoryData] = useState<
    any[]
  >([]);
  const [buttonLoadingDeactivate, setButtonLoadingDeactivate] = useState<
    Record<string, boolean>
  >({});
  const [buttonLoadingDelete, setButtonLoadingDelete] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [allCategoryResponse, allDeactivateCategoryResponse] =
          await Promise.all([GetAllCategory(), GetAllDeactivatedCategory()]);

        if (
          allCategoryResponse &&
          allCategoryResponse.statusCode === 200 &&
          allCategoryResponse.success
        ) {
          setAllCategoryData(allCategoryResponse.data);
        } else {
          setError(allCategoryResponse.message);
        }
        if (
          allDeactivateCategoryResponse &&
          allDeactivateCategoryResponse.statusCode === 200 &&
          allDeactivateCategoryResponse.success
        ) {
          setAllDeactivatedCategoryData(allDeactivateCategoryResponse.data);
        } else {
          setError(allDeactivateCategoryResponse.message);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDeactivate = async (category_id: string, status: boolean) => {
    setButtonLoadingDeactivate((prev) => ({ ...prev, [category_id]: true }));
    try {
      const result = await ToggleCategoryStatus(
        category_id,
        status ? "DEACTIVATE" : "ACTIVATE"
      );

      if (result.statusCode === 200 && result.success) {
        if (status) {
          setAllDeactivatedCategoryData((prev) => [
            ...prev,
            ...allCategoryData.filter((item) => item._id === category_id),
          ]);
          setAllCategoryData((prev) =>
            prev.filter((item) => item._id !== category_id)
          );
        } else {
          setAllCategoryData((prev) => [
            ...prev,
            ...allDeactivatedCategoryData.filter(
              (item) => item._id === category_id
            ),
          ]);
          setAllDeactivatedCategoryData((prev) =>
            prev.filter((item) => item._id !== category_id)
          );
        }

        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDeactivate((prev) => ({ ...prev, [category_id]: false }));
    }
  };

  const handleDelete = async (category_id: string) => {
    setButtonLoadingDelete((prev) => ({ ...prev, [category_id]: true }));
    try {
      const result = await DeleteCategory(category_id);
      if (result.statusCode === 200 && result.success) {
        setAllCategoryData((prev) =>
          prev.filter((item) => item._id !== category_id)
        );
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDelete((prev) => ({ ...prev, [category_id]: false }));
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
          disabled={activeTable === "All Categories"}
          className={`px-3 h-12 ${
            activeTable === "All Categories"
          } ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("All Categories")}>
          {/* <CiDeliveryTruck /> */}
          All Categories
        </Button>
        <Button
          variant="default"
          disabled={activeTable === "Deactivated Categories"}
          className={`px-3 h-12 ${
            activeTable === "Deactivated Categories"
          } ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("Deactivated Categories")}>
          {/* <TbTruckOff /> */}
          Deactivated Categories
        </Button>
      </div>

      <div className="my-10 grid place-items-center">
        <AddNewCategoryDialog>
          <Button className="w-72 max-w-96 h-12 text-[#0d0d0d] bg-[#fcac1c] hover:bg-[#fcac1c]/90">
            Add New Category
          </Button>
        </AddNewCategoryDialog>
      </div>

      <div className="mt-20">
        {activeTable === "All Categories" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <CategoryPageDataTable
                data={allCategoryData ? allCategoryData : []}
                columns={CategoryPageColumns({
                  handleDelete,
                  handleDeactivate,
                  buttonLoadingDelete,
                  buttonLoadingDeactivate,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "Deactivated Categories" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <CategoryPageDataTable
                data={
                  allDeactivatedCategoryData ? allDeactivatedCategoryData : []
                }
                columns={CategoryPageColumns({
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

export default FoodCategoriesPageComp;
