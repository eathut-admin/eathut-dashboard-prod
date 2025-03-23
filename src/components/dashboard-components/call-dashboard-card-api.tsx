import { useEffect, useState } from "react";
import DashboardCardComp from "./dashboard-card";
import { GetDashboardCardCounts } from "@/actions/dashboard/GetDashboardCardCounts.action";

const CallDashboardCardApi = () => {
  const currentDateTime = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [cardsData, setCardsData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await GetDashboardCardCounts();

        if (response.statusCode === 200 && response.success) {
          setCardsData(response.data);
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
    <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCardComp
        title="Daily Order Amount"
        value={`₹ ${cardsData?.dailyOrderAmount || 0}`}
        date={`Today - ${currentDateTime}`}
        loading={loading}
        error={error}
      />
      <DashboardCardComp
        title="Total Order Amount"
        value={`₹ ${cardsData?.totalOrderAmount || 0}`}
        date="all time"
        loading={loading}
        error={error}
      />
      <DashboardCardComp
        title="Total Delivered Orders"
        value={cardsData?.totalOrders || 0}
        date="all time"
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default CallDashboardCardApi;
