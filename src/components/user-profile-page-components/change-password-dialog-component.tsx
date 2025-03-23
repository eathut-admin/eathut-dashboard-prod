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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { FaArrowRightLong } from "react-icons/fa6";
import { useState } from "react";
import { toast } from "sonner";
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";
import { ChangePassword } from "@/actions/auth-admin/ChangePassword.action";

const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Enter old password",
  }),
  newPassword: z
    .string()
    .min(1, {
      message: "Enter new password",
    })
    .regex(/^.{6,}$/, {
      message: "Password must be at least 6 characters long.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least one number.",
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/^(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter.",
    }),
});

const ChangePasswordDialogComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof changePasswordFormSchema>) {
    setLoading(true);

    try {
      const data = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };
      const response = await ChangePassword(data);

      if (response.message && response.error) {
        toast.error(response.message);
      } else if (response.message && !response.error) {
        toast.success(response.message);
      } else {
        toast.error(response.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      form.reset();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            You can change your password here.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="pb-12 pt-5 space-y-3">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative flex items-center border pl-2 rounded-md">
                          <CiLock className="text-xl" />
                          <Input
                            placeholder="Enter old password here..."
                            autoComplete="off"
                            type="text"
                            {...field}
                            className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative flex items-center border pl-2 rounded-md">
                          <CiUnlock className="text-xl" />
                          <Input
                            placeholder="Enter new password here..."
                            autoComplete="off"
                            type="text"
                            {...field}
                            className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter the new password you want to set. And don&apos;t
                        share it with anyone else or you will lose access to
                        your account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="destructive">
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" className="group">
                  {loading ? (
                    <ButtonLoadingAnimation text="Submitting" />
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
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialogComponent;
