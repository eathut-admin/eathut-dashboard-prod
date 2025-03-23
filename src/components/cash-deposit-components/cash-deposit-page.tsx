"use client";

import { useEffect, useState } from "react";
import { CiWallet } from "react-icons/ci";
import CashTable from "./cash-table";
import { Note } from "./cash-table";
import CashWithdrawalForm from "./cash-withdrawal-form";
import { GetCollectedAndRemainingAmount } from "@/actions/cash-deposit/GetCollectedAndRemainingAmount.action";
import ErrorAnimation from "../loading-animations/Error-animation";
import { useUserRole } from "@/context/user-role-context";

interface TotalCash {
  remainingAmount: number;
  collectedAmount: number;
}

const CashDepositPageComp: React.FC = () => {
  const [totalCash, setData] = useState<TotalCash | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedNotesData, setUpdatedNotesData] = useState<Note[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { userRole } = useUserRole();

  useEffect(() => {
    fetchTotalCashData();
  }, []);

  const fetchTotalCashData = async () => {
    setLoading(true);
    try {
      const response = await GetCollectedAndRemainingAmount();

      if (response.statusCode === 200 && response.success) {
        setData(response.data);
      } else {
        setError(response.error);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  const handleCashTableDataChange = (
    updatedNotesData: Note[],
    total: number
  ) => {
    setUpdatedNotesData(updatedNotesData);
    setTotalAmount(total);
  };

  return (
    <section className="mt-5 lg:mt-10">
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          {loading ? (
            <div className="animate-pulse rounded-md bg-gray-300 dark:bg-gray-500 h-20 lg:h-28 w-full"></div>
          ) : (
            <div className="h-20 lg:h-28 rounded-xl bg-muted/50 p-3 lg:px-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold mb-1 md:mb-2">
                  Cash Need to Collect
                </p>
                <div className="text-xl font-semibold">
                  <span className="mr-1 text-sm">₹</span>{" "}
                  {totalCash?.remainingAmount}/-
                </div>
              </div>
              <CiWallet className="text-4xl lg:text-6xl" />
            </div>
          )}
          {loading ? (
            <div className="animate-pulse rounded-md bg-gray-300 dark:bg-gray-500 h-20 lg:h-28 w-full"></div>
          ) : (
            <div className="h-20 lg:h-28 rounded-xl bg-muted/50 p-3 lg:px-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold mb-1 md:mb-2">
                  Cash Already Collected
                </p>
                <div className="text-xl font-semibold">
                  <span className="mr-1 text-sm">₹</span>{" "}
                  {totalCash?.collectedAmount}/-
                </div>
              </div>
              <CiWallet className="text-4xl lg:text-6xl" />
            </div>
          )}
        </div>
        {userRole === "ADMIN" ? (
          <>
            <section className="py-4">
              <CashTable onDataChange={handleCashTableDataChange} />
            </section>
            <CashWithdrawalForm
              onSubmit={fetchTotalCashData}
              total={totalAmount}
              alreadyCollected={totalCash?.collectedAmount ?? 0}
              needToCollect={totalCash?.remainingAmount ?? 0}
              updatedNotesData={updatedNotesData}
            />
          </>
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ErrorAnimation massage="You are not authorized to deposit cash. Only admin can deposit cash." />
          </div>
        )}
      </div>
    </section>
  );
};

export default CashDepositPageComp;
