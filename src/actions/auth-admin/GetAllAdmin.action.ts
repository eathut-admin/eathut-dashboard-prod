"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export async function GetAllAdmin() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { message: "Unauthorized", error: "No access token found." };
  }

  try {
    const response = await apiClient.get("/admins/get-all-admins", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return {
        error: error.response.data?.error || "An error occurred.",
      };
    }
    return { message: "An unknown error occurred.", error: "Unknown error" };
  }
}
