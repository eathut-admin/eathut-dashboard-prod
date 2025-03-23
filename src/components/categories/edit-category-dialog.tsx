"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { FaArrowRightLong } from "react-icons/fa6";
import { Textarea } from "../ui/textarea";
import { IoImages } from "react-icons/io5";
import { handleUploadImage } from "@/utils/upload-image-to-firebase";
import { UpdateCategoryDetails } from "@/actions/category/UpdateCategoryDetails.action";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import compressImage from "@/utils/compress-image";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Enter a category name",
  }),
  description: z.string().min(1, {
    message: "Enter a description",
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

const EditCategoryDataDialog = ({
  children,
  categoryData,
}: {
  children: React.ReactNode;
  categoryData: any;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFileName, setSelectedImageFileName] =
    useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: categoryData?.name,
      description: categoryData?.description,
      image: categoryData?.image,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFileName(file.name);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      form.setValue("image", file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(categoryData?.image);
    setSelectedImageFileName("");
    form.setValue("image", undefined as unknown as File);
  };

  useEffect(() => {
    if (categoryData.image) {
      setImagePreview(categoryData.image);
    }
  }, [categoryData.image]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      let imageUrl = categoryData?.image;

      if (values.image instanceof File) {
        const compressedImageFile = await compressImage(values.image);
        if (typeof compressedImageFile === "string") {
          toast.error(compressedImageFile);
          return;
        }

        const uploadedImageUrl = await handleUploadImage(compressedImageFile);
        if (
          !uploadedImageUrl ||
          uploadedImageUrl ===
            "Invalid file provided. Please upload a valid image file."
        ) {
          toast.error(
            "Invalid file provided. Please upload a valid image file."
          );
          return;
        }

        imageUrl = uploadedImageUrl;
      }

      const dataToBeSent = {
        ...values,
        image: imageUrl,
      };

      const response = await UpdateCategoryDetails(
        categoryData._id,
        dataToBeSent
      );

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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category Data</DialogTitle>
          <DialogDescription>
            Edit category data here. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        {...field}
                        className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        {...field}
                        className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="border h-10 rounded-md flex items-center relative text-gray-500 dark:text-gray-400 overflow-hidden">
                        <div className="dark:bg-white bg-[#000] h-full px-3 dark:text-black text-[#fff] grid place-items-center">
                          <IoImages />
                        </div>
                        <span className="text-[13.5px] ml-2 inline-block font-normal">
                          {selectedImageFileName ? (
                            <span className="text-[#000] dark:text-white">
                              {selectedImageFileName}
                            </span>
                          ) : (
                            "Image comes from database already selected"
                          )}
                        </span>
                        <Input
                          type="file"
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={handleFileChange}
                          className="absolute opacity-0 w-full h-full cursor-pointer top-0 overflow-x-auto"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <section className="grid justify-start">
                {imagePreview && (
                  <div className="flex flex-col items-center">
                    <div className="w-full sm:w-80 h-36 overflow-hidden rounded-lg">
                      <Image
                        width={200}
                        height={200}
                        style={{ width: "auto", height: "auto" }}
                        src={imagePreview}
                        alt="Image preview"
                        className="w-full h-full object-cover object-bottom aspect-video"
                      />
                    </div>
                  </div>
                )}
              </section>

              <div className="pt-8">
                <DialogFooter className="sm:justify-end flex gap-2 md:gap-0">
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={loading}
                      onClick={handleRemoveImage}>
                      <RxCross2 />
                      Remove Image
                    </Button>
                  )}
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
                </DialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDataDialog;
