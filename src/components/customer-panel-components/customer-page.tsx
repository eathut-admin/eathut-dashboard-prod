"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import { AllCustomerPageDataTable } from "@/app/data-table-components/all-customer/All-customer-page-data-table";
import { AllCustomerPageColumns } from "@/app/data-table-components/all-customer/Customer-page-column";
import ErrorAnimation from "../loading-animations/Error-animation";
import { GetAllCustomerDataBasedOnStatus } from "@/actions/customer/GetAllCustomerDataBasedOnStatus.action";
import { ToggleCustomerStatus } from "@/actions/customer/ToggleCustomerStatus.action";

const CustomerPanelPageComp = () => {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState("All Customers");
  const [buttonLoadingBlock, setButtonLoadingBlock] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await GetAllCustomerDataBasedOnStatus(status);
        if ("error" in response) {
          setError(response.error);
        } else {
          setData(response.data);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [status]);

  const handleBlock = async (userId: string) => {
    setButtonLoadingBlock((prev) => ({ ...prev, [userId]: true }));
    try {
      const result = await ToggleCustomerStatus(userId);
      if (result) {
        setData((prevData: any) =>
          prevData.filter((customer: any) => customer.userId !== userId)
        );
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingBlock((prev) => ({ ...prev, [userId]: false }));
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
      <div className="grid grid-cols-4 mt-10 gap-5">
        <Button
          variant="default"
          disabled={activeTable === "All Customers"}
          className={`px-3 h-12 ${
            activeTable === "All Customers" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => {
            setActiveTable("All Customers");
            setStatus("ALL");
          }}>
          All Customers
        </Button>

        <Button
          variant="default"
          disabled={activeTable === "All Active Customers"}
          className={`px-3 h-12 ${
            activeTable === "All Active Customers" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => {
            setActiveTable("All Active Customers");
            setStatus("ACTIVE");
          }}>
          All Active Customers
        </Button>

        <Button
          variant="default"
          disabled={activeTable === "All Inactive Customers"}
          className={`px-3 h-12 ${
            activeTable === "All Inactive Customers" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => {
            setActiveTable("All Inactive Customers");
            setStatus("INACTIVE");
          }}>
          All Inactive Customers
        </Button>

        <Button
          variant="default"
          disabled={activeTable === "New Customers"}
          className={`px-3 h-12 ${
            activeTable === "New Customers" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => {
            setActiveTable("New Customers");
            setStatus("NEW");
          }}>
          New Customers
        </Button>
      </div>

      <div className="mt-20">
        {activeTable === "All Customers" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <AllCustomerPageDataTable
                data={data ? data : []}
                columns={AllCustomerPageColumns({
                  handleBlock,
                  buttonLoadingBlock,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "All Active Customers" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <AllCustomerPageDataTable
                data={data ? data : []}
                columns={AllCustomerPageColumns({
                  handleBlock,
                  buttonLoadingBlock,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "All Inactive Customers" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <AllCustomerPageDataTable
                data={data ? data : []}
                columns={AllCustomerPageColumns({
                  handleBlock,
                  buttonLoadingBlock,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "New Customers" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <AllCustomerPageDataTable
                data={data ? data : []}
                columns={AllCustomerPageColumns({
                  handleBlock,
                  buttonLoadingBlock,
                })}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CustomerPanelPageComp;
