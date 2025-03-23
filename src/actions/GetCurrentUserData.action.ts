"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export async function GetCurrentUserData() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const adminId = cookieStore.get("adminId")?.value;

  if (!accessToken) {
    return { error: "No access token found." };
  }

  if (!adminId) {
    return { error: "No admin ID found." };
  }

  try {
    const response = await apiClient.get(
      `/admins/get-admin-details/${adminId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

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
