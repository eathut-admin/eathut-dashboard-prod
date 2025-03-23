"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoImages } from "react-icons/io5";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { Textarea } from "../ui/textarea";
import { handleUploadImage } from "@/utils/upload-image-to-firebase";
import { AddNewBanner } from "@/actions/banner/AddNewBanner.action";
import compressImage from "@/utils/compress-image";

const addNewBannerFormSchema = z.object({
  title: z.string().min(1, {
    message: "Enter a banner title",
  }),
  description: z.string().min(1, {
    message: "Enter a banner description",
  }),
  image: z
    .union([z.instanceof(File, { message: "Image is required" }), z.null()])
    .refine((file) => file !== null, "Image is required")
    .refine(
      (file) => file !== null && file.size < 3000000,
      "Image size should be less than 3mb"
    )
    .refine(
      (file) =>
        file !== null &&
        (file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/jpg"),
      "Image should be in jpeg, png or jpg format"
    ),
});

const AddNewBannerDialogComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof addNewBannerFormSchema>>({
    resolver: zodResolver(addNewBannerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImageFileName("");
    form.setValue("image", undefined as unknown as File);
  };

  async function onSubmit(values: z.infer<typeof addNewBannerFormSchema>) {
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
      if (imageUrl === "") return;
      if (
        imageUrl === "Invalid file provided. Please upload a valid image file."
      ) {
        toast.error("Invalid file provided. Please upload a valid image file.");
        return;
      }

      const dataToBeSent = {
        ...values,
        image: imageUrl,
      };

      const response = await AddNewBanner(dataToBeSent);

      if (response.error) {
        toast.error(response.error);
      } else {
        handleRemoveImage();
        form.reset();
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="mb-7">
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>
              Add a new banner to your application.
            </DialogDescription>
          </DialogHeader>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter banner title"
                      disabled={loading}
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
                      placeholder="Enter banner description"
                      disabled={loading}
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
                          "Upload Image"
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
                  <div className="bg-green-800 w-full h-40 overflow-hidden rounded-lg">
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
                    onClick={handleRemoveImage}>
                    <RxCross2 />
                    Remove Image
                  </Button>
                )}
                <Button type="submit" className="group">
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
      </DialogContent>
    </Dialog>
  );
};

export default AddNewBannerDialogComponent;
