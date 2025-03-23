"use client";

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
import { useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { CreateNewAdmin } from "@/actions/create-admin/RegisterNewAdmin.action";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .regex(/^\S+@\S+\.\S+$/, {
      message: "Please enter a valid email address.",
    }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least one number.",
    })
    .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, {
      message: "Password must contain at least one special character.",
    })
    .regex(/^.{6,}$/, { message: "Password must be at least 6 characters." }),
  address: z.object({
    street: z.string().optional(),
    area: z.string().optional(),
    city: z.string().min(1, {
      message: "City is required.",
    }),
    state: z.string().min(1, {
      message: "State is required.",
    }),
    pincode: z.string().min(1, {
      message: "Pincode is required.",
    }),
  }),
  phone: z
    .string()
    .min(1, {
      message: "Phone number is required.",
    })
    .regex(/^[0-9]{10}$/, {
      message: "Please enter a valid phone number.",
    }),
});

const CreateAdminDialog = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "Eathut.Admin@123",
      address: {
        street: "",
        area: "",
        city: "Domkal",
        state: "West Bengal",
        pincode: "",
      },
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility: () => void = () => {
    setShowPassword((prev) => !prev);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const dataToBeSent = {
        ...values,
        address: {
          street: values.address.street || "",
          area: values.address.area || "",
          city: values.address.city,
          state: values.address.state,
          pincode: values.address.pincode,
        },
      };

      const response = await CreateNewAdmin(dataToBeSent);

      if (response.error) {
        toast.error(response.error);
      } else {
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
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
            <DialogDescription>
              Fields marked with (*) are required.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 py-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                          Name *
                        </div>
                        <Input
                          placeholder="Enter admin name here..."
                          {...field}
                          className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                          Email *
                        </div>
                        <Input
                          placeholder="Enter admin email here..."
                          {...field}
                          className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
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
                      <div className="relative">
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                            Password *
                          </div>
                          <Input
                            placeholder="Enter admin password here..."
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
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
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                          Phone *
                        </div>
                        <Input
                          placeholder="Enter admin phone here..."
                          {...field}
                          className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-5 grid md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                            Street
                          </div>
                          <Input
                            placeholder="Enter street name"
                            {...field}
                            className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.area"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                            Area
                          </div>
                          <Input
                            placeholder="Enter area name"
                            {...field}
                            className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center h-full">
                            <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                              City *
                            </div>
                            <Input
                              placeholder="Enter city name"
                              {...field}
                              className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                            State *
                          </div>
                          <Input
                            placeholder="Enter state name"
                            {...field}
                            className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-24 pl-3 bg-[#7fb222] rounded-l">
                            Pincode *
                          </div>
                          <Input
                            placeholder="Enter pincode"
                            {...field}
                            className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-8">
                <DialogFooter className="sm:justify-end flex gap-2 md:gap-0">
                  <DialogClose asChild>
                    <Button type="button" variant="destructive">
                      Close
                    </Button>
                  </DialogClose>
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
    </div>
  );
};

export default CreateAdminDialog;
