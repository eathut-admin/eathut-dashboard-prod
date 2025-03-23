"use client";

import { useEffect, useState } from "react";
import { underMaintenanceCheck } from "@/actions/CheckUnderMaintenance.action";
import Image from "next/image";
import { toast } from "sonner";

const UnderMaintenanceComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [underMaintenance, setUnderMaintenance] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await underMaintenanceCheck();

        if (
          response &&
          response.underMaintenance === true &&
          response.statusCode === 200
        ) {
          setUnderMaintenance(response.underMaintenance);
        } else {
          setUnderMaintenance(false); // Change this to : *TRUE
        }
      } catch (error: any) {
        toast.error(error.message);
        setUnderMaintenance(true);
      }
    };

    fetchData();
  }, []);

  if (underMaintenance) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="text-center">
          <div className="mb-8 flex items-center justify-center overflow-hidden">
            <Image
              alt="under maintenance"
              width={200}
              height={200}
              src="/under-maintenance/under-maintenance.gif"
              className="w-[200px] h-[200px]"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Under Maintenance
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8">
            We&apos;re currently working on improving our services. Please check
            back later.
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-200">
            <p>Thank you for your patience!</p>
          </div>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default UnderMaintenanceComponent;
