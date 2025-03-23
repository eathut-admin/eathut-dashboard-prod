import { z } from "zod";

export const updateFoodDetailsFormSchema = z.object({
  name: z.string().min(1, {
    message: "Food name is required.",
  }),
  mrp: z
    .string()
    .min(1, {
      message: "Maximum Retail Price is required.",
    })
    .regex(
      /^(?!0(\.0{1,2})?$)\d+(\.\d{1,5})?$/,
      "Invalid Maximum Retail Price"
    ),
  companyShare: z
    .string()
    .min(1, {
      message: "Company Share is required.",
    })
    .regex(/^(?!0(\.0{1,2})?$)\d+(\.\d{1,5})?$/, "Invalid Company Share"),
  restaurantShare: z
    .string()
    .min(1, {
      message: "Restaurant Share is required.",
    })
    .regex(/^(?!0(\.0{1,2})?$)\d+(\.\d{1,5})?$/, "Invalid Restaurant Share"),
  category: z.string().min(1, {
    message: "Food category is required.",
  }),
  restaurant: z.string().min(1, {
    message: "Restaurant is required.",
  }),
  vegOrNonVeg: z.string().min(1, {
    message: "Veg or Non-veg is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  image: z
    .union([
      z.instanceof(File, { message: "Image is required" }),
      z.string().min(1, { message: "Image is required" }),
    ])
    .refine(
      (value) => {
        if (value instanceof File) {
          return (
            value.size < 3000000 &&
            (value.type === "image/jpeg" ||
              value.type === "image/png" ||
              value.type === "image/jpg")
          );
        }
        return true;
      },
      {
        message:
          "Image should be in jpeg, png, or jpg format and less than 3MB",
      }
    ),
});
