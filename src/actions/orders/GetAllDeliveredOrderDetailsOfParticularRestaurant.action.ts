"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export async function GetAllDeliveredOrderDetailsOfParticularRestaurant(
  restaurantId: string,
  status: string
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { error: "No access token found." };
  }

  try {
    const response = await apiClient.get(
      `/orders/get-order-details-based-on-status-and-restaurant/${restaurantId}`,
      {
        params: {
          status,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        error:
          error.response?.data?.message ||
          error.message ||
          "An error occurred.",
      };
    }
    return { error: "An unknown error occurred." };
  }
}
