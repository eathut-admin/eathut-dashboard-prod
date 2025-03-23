import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { TbNotificationOff } from "react-icons/tb";

const rejectReasonSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, "Reason must be at least 10 characters long."),
});

type RejectReasonFormData = z.infer<typeof rejectReasonSchema>;

export function RejectMoneyWithdrawalRequestCustomAlert({
  onConfirm,
  onCancel,
  name,
  children,
}: {
  onConfirm: (rejectionReason: string) => void;
  onCancel: () => void;
  name?: string;
  children: React.ReactNode;
}) {
  const form = useForm<RejectReasonFormData>({
    resolver: zodResolver(rejectReasonSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const handleConfirm = (data: RejectReasonFormData) => {
    onConfirm(data.rejectionReason);
    form.reset();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to reject {name || ""}&apos;s request?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Please provide a reason for rejection.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirm)}
            className="space-y-4">
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex items-start border pl-2 rounded-md">
                      <TbNotificationOff className="text-xl translate-y-1.5" />
                      <Textarea
                        placeholder="Enter reason for rejection"
                        autoComplete="off"
                        {...field}
                        className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={!form.formState.isValid}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
