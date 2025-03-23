import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PrintPopup from "./print-popup";
import { DepositAmount } from "@/actions/cash-deposit/DepositAmount.action";

interface DepositFormProps {
  onSubmit: () => void;
  total: number;
  updatedNotesData: { note: number | string; count: string }[];
  alreadyCollected: number | null;
  needToCollect: number | null;
}

const cashWithdrawalFromSchema = z
  .object({
    bankName: z.string().min(1, {
      message: "Select a bank name",
    }),
    accountNumber: z
      .string()
      .min(1, {
        message: "Enter account number",
      })
      .regex(/^\d{11,16}$/, "Invalid account number"),
    confirm_account_number: z.string().min(1, {
      message: "Confirm account number",
    }),
    ifscCode: z.string().min(1, {
      message: "Enter account holder name",
    }),
  })
  .refine((data) => data.accountNumber === data.confirm_account_number, {
    message: "Account numbers don't match",
    path: ["confirm_account_number"],
  });

export default function DepositForm({
  onSubmit,
  total,
  updatedNotesData,
  alreadyCollected,
  needToCollect,
}: DepositFormProps) {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [depositData, setDepositData] = useState<any>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<any>(null);

  const form = useForm<z.infer<typeof cashWithdrawalFromSchema>>({
    resolver: zodResolver(cashWithdrawalFromSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      confirm_account_number: "",
      ifscCode: "",
    },
  });

  const handleSubmitForm = (data: z.infer<typeof cashWithdrawalFromSchema>) => {
    const cashDeposit = {
      totalAmount: total,
      paymentInfo: {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
      },
      currencyCount: updatedNotesData.reduce((acc, curr) => {
        const count = parseFloat(curr.count);
        acc[curr.note] = isNaN(count) ? 0 : count;
        return acc;
      }, {} as { [key: string]: number }),
    };

    handleDepositSubmission(cashDeposit);
  };

  const handleDepositSubmission = async (cashDeposit: any) => {
    try {
      const response = await DepositAmount(cashDeposit);

      if (
        response.statusCode === 200 &&
        response.success &&
        setDepositData !== null
      ) {
        toast.success(response.message);
        setAdminData(response.data);
        setDepositData(cashDeposit);
        setIsSubmitted(true);
        setShowPopup(true);
      }
    } catch (error) {
      toast.error("Cash deposit failed! " + error);
    } finally {
      form.reset();
      setIsSubmitted(false);
    }
  };

  return (
    <div className="">
      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)}>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <div className="text-sm shrink-0 py-[10px] w-44 pl-3 bg-[#7fb222] rounded-l">
                          Account Number *
                        </div>
                        <Input
                          placeholder="Enter account number here..."
                          type="password"
                          {...field}
                          className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs dark:text-yellow-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <div className="text-sm shrink-0 py-[10px] w-44 pl-3 bg-[#7fb222] rounded-l">
                          Confirm Account Number *
                        </div>
                        <Input
                          placeholder="Confirm account number here..."
                          {...field}
                          className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs dark:text-yellow-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      {...field}
                      value={field.value}
                      onValueChange={field.onChange}>
                      <FormControl>
                        <div className="flex items-center">
                          <div className="text-sm shrink-0 py-[10px] w-44 pl-3 bg-[#7fb222] rounded-l">
                            Bank Name
                          </div>
                          <SelectTrigger className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select a bank" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent position="popper">
                        <SelectItem value="State Bank of India">
                          State Bank of India
                        </SelectItem>
                        <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                        <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                        <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                        <SelectItem value="Bank of Baroda">
                          Bank of Baroda
                        </SelectItem>
                        <SelectItem value="Punjab National Bank">
                          Punjab National Bank
                        </SelectItem>
                        <SelectItem value="Kotak Mahindra Bank">
                          Kotak Mahindra Bank
                        </SelectItem>
                        <SelectItem value="Yes Bank">Yes Bank</SelectItem>
                        <SelectItem value="IDFC First Bank">
                          IDFC First Bank
                        </SelectItem>
                        <SelectItem value="Bank of India">
                          Bank of India
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs dark:text-yellow-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <div className="text-sm shrink-0 py-[10px] w-44 pl-3 bg-[#7fb222] rounded-l">
                          IFSC Code *
                        </div>
                        <Input
                          placeholder="Enter IFSC code here..."
                          {...field}
                          className="rounded-none rounded-r border-[1.5px] border-[#7fb222] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs dark:text-yellow-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5">
              {alreadyCollected === total &&
              needToCollect === 0 &&
              total > 0 ? (
                <div>
                  <Button
                    type="submit"
                    className="w-full rounded-none h-[42px] bg-green-500 hover:bg-green-700">
                    Confirm Deposit
                  </Button>
                </div>
              ) : (
                <div className="w-full bg-red-500 dark:bg-yellow-500 text-[15px] dark:text-black text-white font-semibold uppercase flex justify-center items-center h-7 rounded-md">
                  {needToCollect != 0 ? (
                    <p>
                      Please collect all available cash first. Cash need to
                      collect must be zero(0).
                    </p>
                  ) : (
                    <p>
                      Deposit cannot be confirmed. The already collected amount
                      must match the grand total.
                    </p>
                  )}
                </div>
              )}
            </div>
          </form>
        </Form>
      ) : (
        ""
      )}
      {showPopup && (
        <PrintPopup
          adminData={adminData ? adminData : []}
          depositData={depositData ? depositData : []}
          onClose={() => setShowPopup(false)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
