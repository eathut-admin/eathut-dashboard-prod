import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export function ShowAllDetailsDialog({
  children,
  riderName,
  generalDetails,
}: {
  children: React.ReactNode;
  riderName: string;
  generalDetails: any;
}) {
  const { address, dateOfBirth, identityVerification, vehicleDetails } =
    generalDetails;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>General Details</DialogTitle>
          <DialogDescription>
            Showing <span className="font-semibold">{riderName}</span> general
            details.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Personal Details Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Phone</p>
                <p>{generalDetails?.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p>{generalDetails?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p>{dateOfBirth}</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p>
                  {address.street && `${address.street}, `}
                  {address.area}, {address.city}, {address.state} -{" "}
                  {address.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Identity Verification Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Identity Verification</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">License Number</p>
                <p>{identityVerification.licenseNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">License Image</p>
                <div className="mt-1">
                  <Link
                    href={identityVerification?.licenseImage}
                    target="_blank"
                    className="underline hover:no-underline">
                    View License
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Vehicle Type</p>
                <p>{vehicleDetails.vehicleType}</p>
              </div>
              <div>
                <p className="text-gray-500">Registration Number</p>
                <p>{vehicleDetails.registrationNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Insurance Details</p>
                <p>{vehicleDetails.insuranceDetails}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
