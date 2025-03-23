import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShowOfferDescriptionComponentDialog = ({
  children,
  offer_id,
  description,
}: {
  children: React.ReactNode;
  offer_id: string;
  description: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{offer_id}</DialogTitle>
        </DialogHeader>
        <div className="py-3">{description}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowOfferDescriptionComponentDialog;
