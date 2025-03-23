import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/restaurant/restaurant-panel",
  "/restaurant/orders",
  "/restaurant/verify-restaurant",
  "/order-track/track-single-order",
  "/order-track/track-multiple-order",
  "/delivery-agent/all-rider",
  "/delivery-agent/verify-rider",
  "/food/add-food",
  "/food/categories",
  "/banners",
  "/payment/cash-collection",
  "/payment/cash-deposit",
  "/payment/money-withdrawal-request",
  "/account/user-profile",
  "/account/contact-us",
  "/customer/customer-panel",
  "/customer/coupon",
  "/customer/offer",
];

export async function middleware(request: any) {
  const { pathname } = request.nextUrl;

  // Check if the requested path is in the protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const accessToken = request.cookies.get("accessToken");

    if (!accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
