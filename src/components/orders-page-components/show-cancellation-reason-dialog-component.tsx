import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ShowCancellationReasonDialog({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cancellation Reason</DialogTitle>
          <DialogDescription>Showing cancellation reason.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm">
          <p>{data || ""}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
