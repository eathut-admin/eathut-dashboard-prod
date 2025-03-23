"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

interface CreateNewFoodRequest {
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

export async function AddNewFood(data: CreateNewFoodRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { message: "Unauthorized", error: "No access token found." };
  }

  try {
    const response = await apiClient.post("/foods/create-food", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return {
        message:
          error.response.data?.message || error.message || "An error occurred.",
        error: error.response.data?.error || "An error occurred.",
      };
    }
    return { message: "An unknown error occurred.", error: "Unknown error" };
  }
}
