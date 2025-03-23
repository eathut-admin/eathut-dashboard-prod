"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export async function GetAllReviewsBasedOnRestaurant(
  queryId: string,
  queryType: string
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { error: "No access token found." };
  }

  try {
    const response = await apiClient.get(
      `/reviews/get-reviews-by-id/${queryId}/${queryType}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.data;
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
