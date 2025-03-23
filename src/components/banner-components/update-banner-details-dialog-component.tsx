"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { FaArrowRightLong } from "react-icons/fa6";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { UpdateBannerDetails } from "@/actions/banner/UpdateBannerDetails.action";
import { toast } from "sonner";

const updateBannerFormSchema = z.object({
  title: z.string().min(1, {
    message: "Please enter a valid title.",
  }),
  description: z.string().min(1, {
    message: "Please enter a valid description.",
  }),
});

const UpdateBannerDetailsDialogComponent = ({
  children,
  title,
  description,
  bannerId,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  bannerId: string;
}) => {
  const form = useForm<z.infer<typeof updateBannerFormSchema>>({
    resolver: zodResolver(updateBannerFormSchema),
    defaultValues: {
      title: title,
      description: description,
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof updateBannerFormSchema>) {
    setLoading(true);

    try {
      const response = await UpdateBannerDetails(bannerId, values);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Banner details updated successfully!");
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update banner details</DialogTitle>
          <DialogDescription>
            Make changes to your banner details here. Click update when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter banner title"
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
                      {...field}
                      className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-8">
              <DialogFooter className="sm:justify-end flex gap-2 md:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="destructive">
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" className="group">
                  {loading ? (
                    <ButtonLoadingAnimation text="Submitting..." />
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

export default UpdateBannerDetailsDialogComponent;
