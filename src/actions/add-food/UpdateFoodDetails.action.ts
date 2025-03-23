"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export interface updateFood {
  name: string;
  description: string;
  price: {
    mrp: number;
    companyShare: number;
    restaurantShare: number;
  };
  image: string;
  restaurant: string;
  category: string;
  vegOrNonVeg: string;
}

export async function UpdateFoodDetails(foodId: string, data: updateFood) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { error: "No access token found." };
  }

  try {
    const response = await apiClient.put(`/foods/update-food/${foodId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return {
        error:
          error.response.data?.message || error.message || "An error occurred.",
      };
    }
    return { error: "An unknown error occurred." };
  }
}
