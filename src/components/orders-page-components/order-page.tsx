"use client";

import { useEffect, useState } from "react";
import ErrorAnimation from "../loading-animations/Error-animation";
import PageLoadingAnimation from "../loading-animations/Page-loading-animation";
import { OrderPageColumns } from "@/app/data-table-components/order-page/Order-page-column";
import { OrderPageDataTable } from "@/app/data-table-components/order-page/Order-page-data-table";
import { MdOutlineCancel, MdOutlinePending } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { Button } from "../ui/button";
import { GetAllOrdersBasedOnStatus } from "@/actions/orders/GetAllOrdersBasedOnStatus.action";

export interface Order {
  _id: string;
  name: string;
  date: string;
}

const OrderPageComp = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState("PENDING");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response = await GetAllOrdersBasedOnStatus(activeTable);

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
  }, [activeTable]);

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <PageLoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 mt-10 gap-5">
        <Button
          variant="default"
          disabled={activeTable === "PENDING"}
          className={`px-3 h-12 ${
            activeTable === "PENDING" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("PENDING")}>
          <MdOutlinePending className="mr-3" />
          Pending Orders
        </Button>

        <Button
          variant="default"
          disabled={activeTable === "DELIVERED"}
          className={`px-3 h-12 ${
            activeTable === "DELIVERED" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("DELIVERED")}>
          <TbTruckDelivery className="mr-3" />
          Delivered Orders
        </Button>

        <Button
          variant="default"
          disabled={activeTable === "CANCELLED"}
          className={`px-3 h-12 ${
            activeTable === "CANCELLED" ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("CANCELLED")}>
          <MdOutlineCancel className="mr-3" />
          Cancelled Orders
        </Button>
      </div>

      <div className="mt-20">
        <OrderPageDataTable
          data={data ? data : []}
          columns={OrderPageColumns}
        />
      </div>
    </main>
  );
};

export default OrderPageComp;
