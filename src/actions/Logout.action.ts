"use server";

import { cookies } from "next/headers";

interface LogoutResponse {
  success: boolean;
}

export const LogoutUser = async (): Promise<LogoutResponse> => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false };
  }

  cookieStore.set("accessToken", "", {
    path: "/",
    maxAge: -1,
  });
  cookieStore.set("adminId", "", {
    path: "/",
    maxAge: -1,
  });
  cookieStore.set("role", "", {
    path: "/",
    maxAge: -1,
  });

  return { success: true };
};
