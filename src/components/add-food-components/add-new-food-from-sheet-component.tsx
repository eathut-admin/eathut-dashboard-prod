"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "@/components/ui/input";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { FaArrowRightLong } from "react-icons/fa6";
import { addNewFoodFormSchema } from "./add-food-form-schema";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoFastFoodOutline, IoImages } from "react-icons/io5";
import { GiTakeMyMoney } from "react-icons/gi";
import { LuIndianRupee, LuVegan } from "react-icons/lu";
import { Textarea } from "../ui/textarea";
import { BiCategoryAlt } from "react-icons/bi";
import { TbFileDescription } from "react-icons/tb";
import { GrRestaurant } from "react-icons/gr";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { GetAllCategory } from "@/actions/category/GetAllCategory.action";
import { GetAllRestaurantDetails } from "@/actions/restaurant/RestaurantDetails.action";
import { toast } from "sonner";
import { handleUploadImage } from "@/utils/upload-image-to-firebase";
import { AddNewFood } from "@/actions/add-food/AddNewFood.action";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { PiCity, PiPiggyBank } from "react-icons/pi";
import compressImage from "@/utils/compress-image";

const AddNewFoodFormSheetComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof addNewFoodFormSchema>>({
    resolver: zodResolver(addNewFoodFormSchema),
    defaultValues: {
      name: "",
      mrp: "",
      restaurantShare: "",
      companyShare: "",
      category: "",
      description: "",
      restaurant: "",
      vegOrNonVeg: "",
      image: undefined,
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [restaurantsLoading, setRestaurantsLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFileName, setSelectedImageFileName] =
    useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFileName(file.name);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      form.setValue("image", file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setCategoriesLoading(true);
      setRestaurantsLoading(true);
      try {
        const [categoriesResponse, restaurantsResponse] = await Promise.all([
          GetAllCategory(),
          GetAllRestaurantDetails(),
        ]);

        if (
          (categoriesResponse && categoriesResponse.statusCode === 200) ||
          categoriesResponse.success
        ) {
          setCategories(categoriesResponse.data);
        }

        if (
          (restaurantsResponse && restaurantsResponse.statusCode === 200) ||
          restaurantsResponse.success
        ) {
          setRestaurants(restaurantsResponse.data);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setCategoriesLoading(false);
        setRestaurantsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImageFileName("");
    form.setValue("image", undefined as unknown as File);
  };

  // async function onSubmit(values: z.infer<typeof addNewFoodFormSchema>) {
  //   setLoading(true);

  //   const compressedImageFile = await compressImage(values.image);
  //   console.log("Compressed Image File: ", compressedImageFile);

  //   try {
  //     const imageUrl = await handleUploadImage(compressedImageFile);

  //     if (imageUrl === "") return;
  //     if (
  //       imageUrl === "Invalid file provided. Please upload a valid image file."
  //     ) {
  //       toast.error("Invalid file provided. Please upload a valid image file.");
  //       return;
  //     }

  //     const dataToBeSent = {
  //       ...values,
  //       vegOrNonVeg: values.vegOrNonVeg.toUpperCase(),
  //       price: {
  //         mrp: Number(values?.mrp),
  //         companyShare: Number(values?.companyShare),
  //         restaurantShare: Number(values?.restaurantShare),
  //       },
  //       image: imageUrl,
  //     };

  //     const response = await AddNewFood(dataToBeSent);

  //     if (response.error) {
  //       toast.error(response.error);
  //     } else {
  //       handleRemoveImage();
  //       form.reset();
  //       window.location.reload();
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function onSubmit(values: z.infer<typeof addNewFoodFormSchema>) {
    setLoading(true);

    try {
      if (!values.image) {
        toast.error("Please upload an image.");
        return;
      }

      const compressedImageFile = await compressImage(values.image);
      if (typeof compressedImageFile === "string") {
        toast.error(compressedImageFile);
        return;
      }

      const imageUrl = await handleUploadImage(compressedImageFile);
      if (
        !imageUrl ||
        imageUrl === "Invalid file provided. Please upload a valid image file."
      ) {
        toast.error("Invalid file provided. Please upload a valid image file.");
        return;
      }

      const dataToBeSent = {
        ...values,
        vegOrNonVeg: values.vegOrNonVeg.toUpperCase(),
        price: {
          mrp: Number(values?.mrp),
          companyShare: Number(values?.companyShare),
          restaurantShare: Number(values?.restaurantShare),
        },
        image: imageUrl,
      };

      const response = await AddNewFood(dataToBeSent);

      if (response.error) {
        toast.error(response.error);
      } else {
        handleRemoveImage();
        form.reset();
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="light:bg-white overflow-scroll">
        <SheetHeader>
          <SheetTitle>Add New Food</SheetTitle>
          <SheetDescription>Add a new food to the restaurant.</SheetDescription>
        </SheetHeader>
        <div className="mt-16">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <section>
                <div className="self-end justify-self-end -translate-y-1.5">
                  <section className="relative grid justify-start border border-gray-400 dark:border-gray-700 rounded-md w-full h-[15rem] cursor-not-allowed">
                    {imagePreview ? (
                      <div className="bg-green-800 w-full h-full overflow-hidden rounded-md">
                        <Image
                          width={200}
                          height={200}
                          src={imagePreview}
                          alt="Image preview"
                          className="w-full h-full object-fill object-bottom aspect-video"
                        />
                      </div>
                    ) : (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="grid place-items-center gap-2">
                          <AiOutlineCloudUpload className="text-7xl" />
                          <p className="text-sm">No Image file Selected</p>
                        </div>
                      </div>
                    )}
                  </section>
                  <div className="flex items-center my-3 gap-3">
                    <section className="grow">
                      <FormField
                        control={form.control}
                        name="image"
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <div
                                className={`border w-full h-11 rounded-md flex items-center relative text-gray-500 dark:text-gray-400 border-gray-400 dark:border-gray-700`}>
                                <div className="bg-[#7fb222] h-full px-3 dark:text-white text-[#000] grid place-items-center">
                                  <IoImages />
                                </div>
                                <span className="text-[13.5px] mx-4 inline-block font-normal">
                                  {selectedImageFileName ? (
                                    <span className="text-[#000] dark:text-white">
                                      {selectedImageFileName}
                                    </span>
                                  ) : (
                                    "Upload Image"
                                  )}
                                </span>
                                <Input
                                  type="file"
                                  accept="image/jpeg, image/png, image/jpg"
                                  title="Select Image"
                                  onChange={handleFileChange}
                                  className="absolute opacity-0 w-full h-full cursor-pointer top-0 overflow-x-auto"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-10 h-11"
                        onClick={handleRemoveImage}>
                        <RxCross2 />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-x-3 gap-y-5 self-end">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative flex items-center border-[1.5px] border-[#7fb222] pl-2 rounded-md">
                            <span>
                              <IoFastFoodOutline className="text-lg ml-1" />
                            </span>
                            <Input
                              autoComplete="off"
                              disabled={loading}
                              placeholder="Enter food name..."
                              className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10 text-[13px]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative flex items-center border-[1.5px] border-[#7fb222] pl-2 rounded-md">
                            <span>
                              <BiCategoryAlt className="text-lg ml-1" />
                            </span>
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}>
                              <SelectTrigger className="border-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <ScrollArea>
                                  {categoriesLoading ? (
                                    <div>
                                      <ButtonLoadingAnimation text="Loading..." />
                                    </div>
                                  ) : categories?.length > 0 ? (
                                    <>
                                      {categories?.map((categories) => (
                                        <SelectItem
                                          key={categories?._id}
                                          value={categories?._id}>
                                          {categories?.name}
                                        </SelectItem>
                                      ))}
                                    </>
                                  ) : (
                                    <div className="text-[10px] -translate-y-1 inline-block bg-yellow-500 text-black px-[14px] py-0.5 rounded-full">
                                      No category found. Add category.
                                    </div>
                                  )}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="xl:col-span-2">
                    <FormField
                      control={form.control}
                      name="mrp"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative flex items-center border-[1.5px] border-[#7fb222] pl-2 rounded-md overflow-hidden">
                              <span>
                                <GiTakeMyMoney className="text-lg ml-1" />
                              </span>
                              <Input
                                autoComplete="off"
                                disabled={loading}
                                placeholder="Enter maximum retail price (mrp)..."
                                className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10 text-[13px]"
                                {...field}
                              />
                              <span className="h-11 px-2.5 flex items-center bg-[#7fb222]">
                                <LuIndianRupee className="text-sm" />
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="restaurantShare"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative flex items-center border-[1.5px] border-[#7fb222] pl-2 rounded-md overflow-hidden">
                            <span>
                              <PiPiggyBank className="text-lg ml-1" />
                            </span>
                            <Input
                              autoComplete="off"
                              disabled={loading}
                              placeholder="Enter restaurant share..."
                              className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10 text-[13px]"
                              {...field}
                            />
                            <span className="h-11 px-2.5 flex items-center bg-[#7fb222]">
                              <LuIndianRupee className="text-sm" />
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyShare"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative flex items-center border-[1.5px] border-[#7fb222] pl-2 rounded-md overflow-hidden">
                            <span>
                              <PiCity className="text-lg ml-1" />
                            </span>
                            <Input
                              autoComplete="off"
                              disabled={loading}
                              placeholder="Enter company share..."
                              className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10 text-[13px]"
                              {...field}
                            />
                            <span className="h-11 px-2.5 flex items-center bg-[#7fb222]">
                              <LuIndianRupee className="text-sm" />
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vegOrNonVeg"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative flex items-center border-[1.5px] border-[#7fb222] pl-2 rounded-md">
                            <span>
                              <LuVegan className="text-lg ml-1" />
                            </span>
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}>
                              <SelectTrigger className="border-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10">
                                <SelectValue placeholder="Select veg or non-veg" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <ScrollArea>
                                  <SelectItem value="veg">Veg</SelectItem>
                                  <SelectItem value="non-veg">
                                    Non-Veg
                                  </SelectItem>
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurant"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative flex items-center border-[1.5px] border-[#7fb222] pl-2 rounded-md">
                            <span>
                              <GrRestaurant className="text-lg ml-1" />
                            </span>
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}>
                              <SelectTrigger className="border-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10">
                                <SelectValue placeholder="Select a restaurant" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <ScrollArea>
                                  {restaurantsLoading ? (
                                    <ButtonLoadingAnimation text="Loading..." />
                                  ) : restaurants?.length > 0 ? (
                                    <>
                                      {restaurants?.map((restaurant) => (
                                        <SelectItem
                                          key={restaurant?.docId}
                                          value={restaurant?.docId}>
                                          {restaurant?.restaurantName}
                                        </SelectItem>
                                      ))}
                                    </>
                                  ) : (
                                    <div className="text-[10px] -translate-y-1 inline-block bg-yellow-500 text-black px-[14px] py-0.5 rounded-full">
                                      No restaurant found. Add restaurant.
                                    </div>
                                  )}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="xl:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative flex items-start border-[1.5px] border-[#7fb222] pl-2 rounded-md">
                              <span>
                                <TbFileDescription className="text-lg ml-1 mt-2" />
                              </span>
                              <Textarea
                                autoComplete="off"
                                disabled={loading}
                                placeholder="Enter food description here..."
                                className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10 text-[13px]"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-between gap-2 mt-12">
                <SheetClose asChild>
                  <Button type="button" variant="destructive">
                    Close
                  </Button>
                </SheetClose>

                <Button type="submit" className="group" disabled={loading}>
                  {loading ? (
                    <ButtonLoadingAnimation text="Adding..." />
                  ) : (
                    <>
                      <FaArrowRightLong className="hidden md:inline-block group-hover:translate-x-6 transition-all duration-300" />
                      <span className="md:group-hover:opacity-0 group-hover:-z-10 transition-all duration-300 text-[14px] font-semibold">
                        Submit
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddNewFoodFormSheetComponent;
