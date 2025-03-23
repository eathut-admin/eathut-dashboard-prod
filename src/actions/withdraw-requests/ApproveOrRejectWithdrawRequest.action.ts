"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export async function approveOrRejectWithdrawRequest(
  withdrawId: string,
  data: {
    status: "COMPLETED" | "REJECTED";
    rejectionReason: string;
  }
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { error: "No access token found." };
  }

  try {
    const dataToBeSent = {
      ...data,
      rejectionReason:
        data.rejectionReason === "" ? null : data.rejectionReason,
    };

    const response = await apiClient.patch(
      `/withdrawals/approve-or-reject-withdraw-request/${withdrawId}`,
      dataToBeSent,
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
