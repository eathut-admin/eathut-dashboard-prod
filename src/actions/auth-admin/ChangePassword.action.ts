"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

interface ErrorResponse {
  message: string;
  error: string;
}

export async function ChangePassword(
  data: PasswordChangeRequest
): Promise<ErrorResponse> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { message: "Unauthorized", error: "No access token found." };
  }

  try {
    const response = await apiClient.post("/admins/change-password", data, {
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
