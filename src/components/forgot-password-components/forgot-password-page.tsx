"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CiUnlock } from "react-icons/ci";
import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";
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
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { ResetPassword } from "@/actions/auth-admin/ResetPassword.action";
import { toast } from "sonner";
import { useState } from "react";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";

const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .regex(/^\S+@\S+\.\S+$/, {
      message: "Please enter a valid email address.",
    }),
});

export function ForgotPasswordPageComp({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
    setLoading(true);
    try {
      const response = await ResetPassword(values.email);

      if (response.message && response.error) {
        toast.error(response.message);
      } else if (response.message && !response.error) {
        form.reset();
        router.push("/");
      } else {
        toast.error(response.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <section>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 mb-8">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-9 w-9 items-center justify-center rounded-md p-1">
                <CiUnlock className="size-6" />
              </div>
              <span className="sr-only">Eathut</span>
            </Link>
            <h1 className="text-xl font-bold">Forgot your password</h1>
            <div className="text-center text-sm">
              Go back to -
              <Link href="/" className="underline underline-offset-4 ml-1">
                Login page
              </Link>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative flex items-center border pl-2 rounded-md">
                        <MdOutlineMarkEmailRead className="text-xl" />
                        <Input
                          placeholder="mail@example.com"
                          autoComplete="off"
                          type="text"
                          {...field}
                          className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="">
                      Enter your email address and we will send you a link to
                      reset your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {loading ? (
                  <ButtonLoadingAnimation text="Sending..." />
                ) : (
                  "Submit Reset Link"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </section>
      <div className="absolute top-4 right-4 border border-gray-300 dark:border-gray-500 rounded-full">
        <ThemeSwitcher />
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
