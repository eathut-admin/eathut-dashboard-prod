import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ShowFoodDescriptionDialog({
  children,
  foodName,
  description,
}: {
  children: React.ReactNode;
  foodName: string;
  description: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{foodName} Description</DialogTitle>
        </DialogHeader>
        <div className="text-[15px] leading-6 py-3">{description}</div>
      </DialogContent>
    </Dialog>
  );
}
