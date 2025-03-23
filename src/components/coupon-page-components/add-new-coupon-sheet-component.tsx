"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { AddNewCoupon } from "@/actions/coupon/AddNewCoupon.action";
import { GetAllUserDataForCoupon } from "@/actions/coupon/GetAllUserDataForCoupon.action";

const formSchema = z
  .object({
    code: z.string().min(2, {
      message: "Coupon code must be at least 2 characters.",
    }),
    discountType: z.string().min(1, {
      message: "Please select a discount type.",
    }),
    type: z.string().min(1, {
      message: "Please select a coupon type.",
    }),
    discountValue: z.string().min(1, {
      message: "Please enter a discount value.",
    }),
    minOrderValue: z.string().min(1, {
      message: "Please enter a minimum order value.",
    }),
    maxDiscountValue: z.string().optional(),
    expiryDate: z
      .date()
      .refine((val) => val !== null, { message: "Please select a date." })
      .refine((val) => val !== undefined, { message: "Please select a date." })
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Please select a valid expiration date.",
      })
      .refine((val) => val > new Date(), {
        message: "Expiration date must be in the future.",
      }),
    usageLimit: z.string().min(1, {
      message: "Please enter usage limit.",
    }),
    userSpecific: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.discountType === "percentage" && !data.maxDiscountValue) {
        return false;
      }
      return true;
    },
    {
      message:
        "Max discount value is required when discount type is percentage.",
      path: ["maxDiscountValue"],
    }
  );

const AddNewCouponSheetComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discountType: "",
      type: "",
      discountValue: "",
      minOrderValue: "",
      maxDiscountValue: "",
      expiryDate: new Date(),
      usageLimit: "1",
      userSpecific: [],
    },
  });

  const [discountType, setDiscountType] = useState<boolean>(false);
  const [dateSelectionClicked, setDateSelectionClicked] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetAllUserDataForCoupon();

        if (response.statusCode === 200 && response.success) {
          setUsers(response.data);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectChange = (name: string, value: string) => {
    if (name === "type") {
      if (value === "Specific") {
        setShowDialog(true);
      } else {
        setShowDialog(false);
        setSelectedUserIds([]);
      }
    }
  };

  const handleUserSelect = (_id: string) => {
    setSelectedUserIds((prevIds) => {
      const newIds = prevIds.includes(_id)
        ? prevIds.filter((id) => id !== _id)
        : [...prevIds, _id];
      return newIds;
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      if (values.type === "Specific" && selectedUserIds.length === 0) {
        toast.error("Please select at least one user for Specific Use coupon.");
        setLoading(false);
        return;
      }

      const dataToBeSent = {
        ...values,
        discountType: values.discountType.toUpperCase(),
        type: values.type.toUpperCase(),
        userSpecific: selectedUserIds,
      };

      const response = await AddNewCoupon(dataToBeSent);

      if (response.error) {
        toast.error(response.error);
      } else {
        setDateSelectionClicked(false);
        setDiscountType(false);
        setShowDialog(false);
        setSelectedUserIds([]);
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
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="light:bg-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Coupon</SheetTitle>
          <SheetDescription>
            All fields are required. Please fill in the required fields to add a
            new coupon.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-16">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                          coupon code
                        </div>
                        <Input
                          placeholder="Enter coupon code"
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
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setDiscountType(value === "percentage");
                      }}>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                            Discount Type
                          </div>
                          <SelectTrigger className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select a discount type" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleSelectChange("type", value);
                      }}
                      defaultValue={field.value}>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                            Coupon Type
                          </div>
                          <SelectTrigger className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select coupon type" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single Use</SelectItem>
                        <SelectItem value="Specific">Specific Use</SelectItem>
                        <SelectItem value="All">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                          Discount Value
                        </div>
                        <Input
                          placeholder="Enter discount value"
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
                name="minOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                          Minimum Order Value
                        </div>
                        <Input
                          placeholder="Enter minimum order value"
                          {...field}
                          className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {discountType && (
                <FormField
                  control={form.control}
                  name="maxDiscountValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                            Maximum Discount Value
                          </div>
                          <Input
                            placeholder="Enter maximum discount value"
                            {...field}
                            className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <div className="relative">
                          <div className="flex items-center h-full">
                            <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                              Expiration Date
                            </div>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                onClick={() => {
                                  setDateSelectionClicked(
                                    !dateSelectionClicked
                                  );
                                  if (dateSelectionClicked) {
                                    setDate(undefined);
                                  }
                                }}
                                className={cn(
                                  "w-full pl-3 text-left font-normal rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0",
                                  !date && "text-muted-foreground"
                                )}>
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span>Pick expiration date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                          </div>
                          {dateSelectionClicked && !date && (
                            <div
                              className="w-fit px-3 justify-end flex absolute right-0 bg-white dark:bg-black mt-1 rounded-sm py-3 z-50"
                              style={{
                                boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 1px",
                              }}>
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                  setDate(selectedDate);
                                  field.onChange(selectedDate);
                                }}
                                initialFocus
                              />
                            </div>
                          )}
                        </div>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                          Usage Limit
                        </div>
                        <Input
                          placeholder="Enter usage limit"
                          {...field}
                          className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <Textarea
                disabled
                value={
                  selectedUserIds.length > 0
                    ? selectedUserIds.join(", ")
                    : "No users selected"
                }
                className="border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                readOnly></Textarea> */}

              <Textarea
                disabled
                value={
                  selectedUserIds.length > 0
                    ? selectedUserIds
                        .map((id) => {
                          const user = users.find((user) => user._id === id);
                          return user ? user.name : null;
                        })
                        .filter((name) => name !== null)
                        .join(", ")
                    : "No users selected"
                }
                className="border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                readOnly
              />

              <div className="pt-20">
                <Button type="submit" className="w-full">
                  {loading ? (
                    <ButtonLoadingAnimation text="Submitting" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Specific Users</DialogTitle>
                <DialogDescription>
                  Select users for this coupon.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Search users with name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <ScrollArea className="max-h-60">
                <div className="space-y-1">
                  {filteredUsers?.map((user: any, index: number) => (
                    <div
                      key={user?._id + index}
                      className="flex items-start p-2 cursor-pointer border rounded-md">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user?._id)}
                        onChange={() => handleUserSelect(user?._id)}
                        className="mr-2.5 translate-y-1"
                      />
                      <div className="flex text-[13px] w-full justify-between">
                        <div className="flex flex-col">
                          <span>
                            Name :{" "}
                            <span className="font-semibold">{user?.name}</span>
                          </span>
                          <span className="text-xs">
                            User Id :{" "}
                            <span className="font-semibold">
                              {user?.userId}
                            </span>
                          </span>
                        </div>
                        <div className="text-[10.9px]">
                          {new Date(user?.joinedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <DialogFooter>
                <DialogClose asChild>
                  <Button className="group py-4 w-48 flex justify-center items-center">
                    <span>Select</span>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddNewCouponSheetComponent;
