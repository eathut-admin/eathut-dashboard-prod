"use server";

import apiClient from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

interface AddNewCoupon {
  userSpecific: string[];
  code: string;
  discountType: string;
  type: string;
  discountValue: string;
  minOrderValue: string;
  expiryDate: Date;
  usageLimit: string;
  maxDiscountValue?: string | undefined;
}

export async function AddNewCoupon(data: AddNewCoupon) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { error: "No access token found." };
  }

  try {
    const response = await apiClient.post(`/coupons/create-coupon`, data, {
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
