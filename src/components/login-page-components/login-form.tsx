"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { ThemeSwitcher } from "../theme-switcher";
import Link from "next/link";
import LoginAnimation from "./LoginAnimation";
import { LoginUser } from "@/actions/Login.action";
import { Toaster, toast } from "sonner";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { LuLockKeyhole } from "react-icons/lu";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { useRouter } from "next/navigation";
import LoginSuccessPage from "../login-successful-component";

interface LoginResponse {
  message?: string;
  error?: string;
  redirect?: {
    destination: string;
  };
}

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Please enter a valid email address.",
    }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);
  const router = useRouter();

  const togglePasswordVisibility: () => void = () => {
    setShowPassword((prev) => !prev);
  };

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    form.reset();

    const data = { email: values.email, password: values.password }; // Data To Be Sent To Backend

    setLoading(true);

    try {
      const result: LoginResponse = await LoginUser(data);
      if (result.message) {
        setIsLoginSuccess(true);
        setTimeout(() => {
          router.push(result.redirect?.destination || "/");
        }, 3000);
      } else if (result.error) {
        toast.error(`Failed!! ${result.error}`, {
          position: "top-center",
        });
      }
    } catch (error: any) {
      toast.error("Something went wrong !!", error?.message);
    } finally {
      setLoading(false);
    }
  }

  if (isLoginSuccess) {
    return (
      <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center">
        <LoginSuccessPage />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 md:p-8">
                  <div className="flex flex-col gap-6 ">
                    <div className="flex flex-col items-center text-center mb-8">
                      <h1 className="text-2xl font-bold">Welcome back</h1>
                      <p className="text-balance text-muted-foreground">
                        Login to your Eathut Admin account
                      </p>
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative flex items-center border pl-2 rounded-md">
                                <span>
                                  <MdOutlineMarkEmailRead className="text-xl" />
                                </span>
                                <Input
                                  autoComplete="off"
                                  disabled={loading}
                                  placeholder="Your email id here..."
                                  className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-11"
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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative flex items-center border pl-2 rounded-md">
                                <span>
                                  <LuLockKeyhole className="text-xl" />
                                </span>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  autoComplete="off"
                                  disabled={loading}
                                  placeholder="Your password here..."
                                  className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-11"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                  onClick={togglePasswordVisibility}>
                                  {showPassword ? (
                                    <Eye size={20} />
                                  ) : (
                                    <EyeClosed size={20} />
                                  )}
                                </button>
                                <Link
                                  href="/forgot-password"
                                  className="absolute right-3 text-xs -bottom-6 underline hover:no-underline">
                                  Forgot your password?
                                </Link>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full mt-4">
                      {loading ? (
                        <ButtonLoadingAnimation text="Loading" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground"></span>
                    </div>
                    <div className="flex justify-center items-center">
                      <LoginAnimation />
                    </div>
                  </div>
                </form>
              </Form>
              <div className="hidden md:flex items-center justify-center bg-gray-100 rounded-r-lg">
                <div className="text-center">
                  <Image
                    width={1000}
                    height={1000}
                    alt="Illustration"
                    src="/login-page/login-page.svg"
                    className="w-72 mx-auto mb-4 object-cover object-center"
                  />
                  <p className="text-lg text-gray-700">
                    Delicious meals delivered fast, satisfy your cravings!
                    <br />
                    <strong>Eathut Admin Panel</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <Link href="#">Terms of Service</Link> and{" "}
            <Link href="#">Privacy Policy</Link>.
          </div>

          <div className="absolute top-4 right-4 border border-gray-300 dark:border-gray-500 rounded-full">
            <ThemeSwitcher />
          </div>
          <div className="absolute bottom-4 right-4 flex flex-col items-end px-3">
            <Link href="https://appariumnewapp.vercel.app/" target="_blank">
              <span className="hidden md:block ml-2 mt-2 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                Created and Developed by <strong>Supranostik</strong>, 2024
              </span>
            </Link>
          </div>
          <Toaster richColors />
        </div>
      </div>
    </div>
  );
}
