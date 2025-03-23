"use server";

import apiClient from "@/lib/axios";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
  error: string;
}

export async function ResetPassword(email: string): Promise<ErrorResponse> {
  try {
    const response = await apiClient.post("/admins/send-reset-password-link", {
      email,
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
