"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import TableLoadingAnimation from "../loading-animations/Table-loading-animation";
import AddNewOfferSheetComponent from "./add-new-offer-sheet-component";
import { OfferPageColumns } from "@/app/data-table-components/offer-page/Offer-page-column";
import { OfferPageDataTable } from "@/app/data-table-components/offer-page/Offer-page-data-table";
import { toast } from "sonner";
import { useUserRole } from "@/context/user-role-context";
import { GetAllAvailableOffers } from "@/actions/offer/GetAllAvailableOffers.action";
import { GetAllExpiredOffers } from "@/actions/offer/GetAllExpiredOffers.action";
import ErrorAnimation from "../loading-animations/Error-animation";
import { DeleteOffer } from "@/actions/offer/DeleteOffer.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FcCancel } from "react-icons/fc";

const OfferPageComp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allAvailableOffers, setAllAvailableOffers] = useState<any[]>([]);
  const [allExpiredOffers, setAllExpiredOffers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<string>(
    "All Available Offers"
  );
  const [buttonLoadingDelete, setButtonLoadingDelete] = useState<
    Record<string, boolean>
  >({});

  const { userRole } = useUserRole();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTable === "All Available Offers") {
          const allAvailableOffersResponse = await GetAllAvailableOffers();
          if (
            allAvailableOffersResponse &&
            (allAvailableOffersResponse.statusCode === 200 ||
              allAvailableOffersResponse.success)
          ) {
            setAllAvailableOffers(allAvailableOffersResponse.data);
          }
        } else if (activeTable === "All Expired Offers") {
          const allExpiredOffersResponse = await GetAllExpiredOffers();
          if (
            allExpiredOffersResponse &&
            (allExpiredOffersResponse.statusCode === 200 ||
              allExpiredOffersResponse.success)
          ) {
            setAllExpiredOffers(allExpiredOffersResponse.data);
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

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  const handleDelete = async (offerId: string) => {
    setButtonLoadingDelete((prev) => ({ ...prev, [offerId]: true }));
    try {
      const result = await DeleteOffer(offerId);
      if (result.success) {
        setAllAvailableOffers((prevData) =>
          prevData.filter((offer) => offer._id !== offerId)
        );

        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoadingDelete((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  return (
    <main className="min-h-full">
      <div className="grid lg:grid-cols-2 gap-5 mt-12">
        <Button
          variant="default"
          disabled={activeTable === "All Available Offers"}
          className={`px-3 h-12 ${
            activeTable === "All Available Offers"
          } ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("All Available Offers")}>
          All Available Offers
        </Button>
        <Button
          variant="default"
          disabled={activeTable === "All Expired Offers"}
          className={`px-3 h-12 ${
            activeTable === "All Expired Offers"
          } ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setActiveTable("All Expired Offers")}>
          All Expired Offers
        </Button>
      </div>

      <div className="my-10 grid place-items-center">
        {userRole === "SUPER-ADMIN" ? (
          <AddNewOfferSheetComponent>
            <Button className="w-72 max-w-96 h-12 text-[#0d0d0d] bg-[#fcac1c] hover:bg-[#fcac1c]/90">
              Add New Offer
            </Button>
          </AddNewOfferSheetComponent>
        ) : (
          <Alert className="max-w-96 mx-auto">
            <FcCancel className="h-4 w-4" />
            <AlertTitle>Sorry, admin.</AlertTitle>
            <AlertDescription>
              You don&apos;t have permission to add a new offer.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="mt-16">
        {activeTable === "All Available Offers" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <OfferPageDataTable
                data={allAvailableOffers ? allAvailableOffers : []}
                columns={OfferPageColumns({
                  userRole,
                  handleDelete,
                  buttonLoadingDelete,
                })}
              />
            )}
          </div>
        )}

        {activeTable === "All Expired Offers" && (
          <div>
            {loading ? (
              <TableLoadingAnimation />
            ) : (
              <OfferPageDataTable
                data={allExpiredOffers ? allExpiredOffers : []}
                columns={OfferPageColumns({
                  userRole,
                  handleDelete,
                  buttonLoadingDelete,
                })}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default OfferPageComp;
