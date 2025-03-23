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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ButtonLoadingAnimation from "../loading-animations/Button-animation";
import { Textarea } from "../ui/textarea";
import { Plus, Minus } from "lucide-react";
import { CreateNewOffer } from "@/actions/offer/CreateNewOffer.action";
import { toast } from "sonner";

const formSchema = z
  .object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(1, {
      message: "Please enter a description.",
    }),
    minOrderAmount: z.string().min(1, {
      message: "Please enter minimum order amount.",
    }),
    offerType: z.string().min(1, {
      message: "Please select a offer type.",
    }),
    validFrom: z
      .date()
      .refine((val) => val !== null, { message: "Please select a date." })
      .refine((val) => val !== undefined, { message: "Please select a date." })
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Please select a valid activation date.",
      })
      .refine(
        (val) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(val);
          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        {
          message: "Date must be today or later.",
        }
      ),
    validUntil: z
      .date()
      .refine((val) => val !== null, { message: "Please select a date." })
      .refine((val) => val !== undefined, { message: "Please select a date." })
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Please select a valid expiration date.",
      })
      .refine(
        (val) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(val);
          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate > today;
        },
        {
          message: "Expiration date must be in the future.",
        }
      ),
    discount: z
      .object({
        percentage: z.number().optional(),
        flatAmount: z.number().optional(),
      })
      .optional(),
    freeItems: z
      .array(
        z.object({
          name: z.string().min(1, { message: "Name is required." }),
          quantity: z.string().min(1, { message: "Quantity is required." }),
          price: z.string().min(0, { message: "Price is required." }),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.offerType === "DISCOUNT" &&
        data.discount?.percentage !== undefined
      ) {
        return !!data.discount.percentage;
      }
      return true;
    },
    {
      message: "Percentage is required when discount type is percentage.",
      path: ["discount", "percentage"],
    }
  )
  .refine(
    (data) => {
      if (
        data.offerType === "DISCOUNT" &&
        data.discount?.flatAmount !== undefined
      ) {
        return !!data.discount.flatAmount;
      }
      return true;
    },
    {
      message: "Flat amount is required when discount type is flat amount.",
      path: ["discount", "flatAmount"],
    }
  )
  .refine(
    (data) => {
      if (data.offerType === "FREE-ITEM") {
        return data.freeItems && data.freeItems.length > 0;
      }
      return true;
    },
    {
      message: "At least one free item is required.",
      path: ["freeItems"],
    }
  )
  .refine(
    (data) => {
      if (data.validFrom && data.validUntil) {
        const validFromDate = new Date(data.validFrom);
        validFromDate.setHours(0, 0, 0, 0);
        const validUntilDate = new Date(data.validUntil);
        validUntilDate.setHours(0, 0, 0, 0);
        return validUntilDate >= validFromDate;
      }
      return true;
    },
    {
      message:
        "Expiration date must be greater than or equal to the valid from date.",
      path: ["validUntil"],
    }
  );

const AddNewOfferSheetComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      minOrderAmount: "",
      offerType: "",
      validFrom: new Date(),
      validUntil: new Date(),
      discount: {
        percentage: undefined,
        flatAmount: undefined,
      },
      freeItems: [],
    },
  });

  const [offerType, setOfferType] = useState<string>("");
  const [discountType, setDiscountType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dateSelectionClickedValidFrom, setDateSelectionClickedValidFrom] =
    useState<boolean>(false);
  const [dateValidFrom, setDateValidFrom] = useState<Date>();
  const [dateSelectionClickedValidUntil, setDateSelectionClickedValidUntil] =
    useState<boolean>(false);
  const [dateValidUntil, setDateValidUntil] = useState<Date>();
  const [freeItems, setFreeItems] = useState([
    { name: "", quantity: "", price: "" },
  ]);

  const { setValue } = form;

  const addFreeItem = () => {
    const newFreeItems = [...freeItems, { name: "", quantity: "", price: "" }];
    setFreeItems(newFreeItems);
    setValue("freeItems", newFreeItems);
  };

  const removeFreeItem = (index: number) => {
    const updatedItems = freeItems.filter((_, i) => i !== index);
    setFreeItems(updatedItems);
    setValue("freeItems", updatedItems);
  };

  const handleFreeItemChange = (
    index: number,
    field: "name" | "quantity" | "price",
    value: string
  ) => {
    const updatedItems = [...freeItems];
    updatedItems[index][field] = value;
    setFreeItems(updatedItems);
    setValue("freeItems", updatedItems);
  };

  const handleDiscountTypeChange = (value: string) => {
    setDiscountType(value);
    setValue("discount.percentage", undefined);
    setValue("discount.flatAmount", undefined);
  };

  const handleOfferTypeChange = (value: string) => {
    setOfferType(value);
    setDiscountType("");
    setValue("discount.percentage", undefined);
    setValue("discount.flatAmount", undefined);
    setValue("freeItems", []);
    setFreeItems([{ name: "", quantity: "", price: "" }]);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const dataToBeSent = {
        ...values,
        discount: {
          percentage: values.discount?.percentage || null,
          flatAmount: values.discount?.flatAmount || null,
        },
        freeDelivery: offerType === "FREE-DELIVERY" ? true : false,
        freeItems:
          offerType === "FREE-ITEM"
            ? freeItems.map((item) => ({
                ...item,
                quantity: parseFloat(item.quantity) || 0,
                price: parseFloat(item.price) || 0,
              }))
            : [],
      };

      const response = await CreateNewOffer(dataToBeSent);

      if (response.error) {
        toast.error(response.error);
      } else {
        setOfferType("");
        setLoading(false);
        form.reset();
        setFreeItems([{ name: "", quantity: "", price: "" }]);
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
          <SheetTitle>Add New Offer</SheetTitle>
          <SheetDescription>
            All fields are required. Please fill in the required fields to add a
            new offer.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-16">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                          Offer Title
                        </div>
                        <Input
                          placeholder="Enter offer title"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <Textarea
                          placeholder="Enter offer description"
                          {...field}
                          className="rounded border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-full">
                        <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                          Minimum Order Amount
                        </div>
                        <Input
                          placeholder="Enter minimum order amount"
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
                name="offerType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleOfferTypeChange(value);
                      }}>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                            Offer Type
                          </div>
                          <SelectTrigger className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select a offer type" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DISCOUNT">Discount</SelectItem>
                        <SelectItem value="FREE-ITEM">Free Item</SelectItem>
                        <SelectItem value="FREE-DELIVERY">
                          Free Delivery
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <div className="relative">
                          <div className="flex items-center h-full">
                            <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                              Valid From
                            </div>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                onClick={() => {
                                  setDateSelectionClickedValidFrom(
                                    !dateSelectionClickedValidFrom
                                  );
                                  if (dateSelectionClickedValidFrom) {
                                    setDateValidFrom(undefined);
                                  }
                                }}
                                className={cn(
                                  "w-full pl-3 text-left font-normal rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0",
                                  !dateValidFrom && "text-muted-foreground"
                                )}>
                                {dateValidFrom ? (
                                  format(dateValidFrom, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                          </div>
                          {dateSelectionClickedValidFrom && !dateValidFrom && (
                            <div
                              className="w-fit px-3 justify-end flex absolute right-0 bg-white dark:bg-black mt-1 rounded-sm py-3 z-50"
                              style={{
                                boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 1px",
                              }}>
                              <Calendar
                                mode="single"
                                selected={dateValidFrom}
                                onSelect={(selectedDate) => {
                                  setDateValidFrom(selectedDate);
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
                name="validUntil"
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
                                  setDateSelectionClickedValidUntil(
                                    !dateSelectionClickedValidUntil
                                  );
                                  if (dateSelectionClickedValidUntil) {
                                    setDateValidUntil(undefined);
                                  }
                                }}
                                className={cn(
                                  "w-full pl-3 text-left font-normal rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0",
                                  !dateValidUntil && "text-muted-foreground"
                                )}>
                                {dateValidUntil ? (
                                  format(dateValidUntil, "PPP")
                                ) : (
                                  <span>Pick expiration date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                          </div>
                          {dateSelectionClickedValidUntil &&
                            !dateValidUntil && (
                              <div
                                className="w-fit px-3 justify-end flex absolute right-0 bg-white dark:bg-black mt-1 rounded-sm py-3 z-50"
                                style={{
                                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 1px",
                                }}>
                                <Calendar
                                  mode="single"
                                  selected={dateValidUntil}
                                  onSelect={(selectedDate) => {
                                    setDateValidUntil(selectedDate);
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
              {offerType === "DISCOUNT" && (
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleDiscountTypeChange(value);
                        }}>
                        <FormControl>
                          <div className="flex items-center h-full">
                            <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                              Discount Type
                            </div>
                            <SelectTrigger className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
                              <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">percentage</SelectItem>
                          <SelectItem value="flatAmount">
                            Flat Amount
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {discountType === "percentage" && (
                <FormField
                  control={form.control}
                  name="discount.percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                            Percentage Value
                          </div>
                          <Input
                            placeholder="Enter percentage value (Exm: 50)"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseFloat(e.target.value)
                              )
                            }
                            className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {discountType === "flatAmount" && (
                <FormField
                  control={form.control}
                  name="discount.flatAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center h-full">
                          <div className="text-sm shrink-0 py-[10px] w-40 grid place-items-center bg-[#7fb222] rounded-l">
                            Flat Amount
                          </div>
                          <Input
                            placeholder="Enter flat amount value (Exm: 50)"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseFloat(e.target.value)
                              )
                            }
                            className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {offerType === "FREE-ITEM" && (
                <section className="pt-5">
                  <span className="text-sm font-semibold block mb-2">
                    You selected offer type as free item. Please add free items.
                  </span>
                  {freeItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-1 mb-4">
                      <div className="flex items-center h-full">
                        <Input
                          placeholder="Enter free item name"
                          value={item.name}
                          onChange={(e) =>
                            handleFreeItemChange(index, "name", e.target.value)
                          }
                          className="rounded border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="flex items-center h-full">
                        <Input
                          placeholder="Enter free item quantity (Exm: 1)"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleFreeItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="rounded border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center h-full">
                          <Input
                            placeholder="Enter free item price (Exm: 99)"
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleFreeItemChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            className="rounded border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeFreeItem(index)}
                          className="col-span-2 mt-2">
                          <Minus className="h-4 w-4" /> Remove Item
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" onClick={addFreeItem} className="mt-2">
                    <Plus className="h-4 w-4" /> Add Another Item
                  </Button>
                </section>
              )}

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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddNewOfferSheetComponent;
