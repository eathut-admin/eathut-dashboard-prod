"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

interface CreateNewAdmin {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export async function CreateNewAdmin(data: CreateNewAdmin) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { error: "No access token found." };
  }

  try {
    const response = await apiClient.post(`/admins/register`, data, {
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
