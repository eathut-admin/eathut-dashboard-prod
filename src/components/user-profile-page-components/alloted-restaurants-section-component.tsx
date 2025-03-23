import { HandPlatter } from "lucide-react";

const AllotedRestaurantsSectionComponent = ({ data }: { data: any }) => {
  return (
    <div className="min-h-full grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
      {data.map((restaurant: any, index: number) => (
        <div key={index} className="border-2 p-6 pb-12 rounded-lg relative">
          {/* Icon */}
          <HandPlatter className="absolute right-4 top-4 w-6 h-6" />

          {/* Restaurant Name */}
          <h3 className="text-xl font-semibold mb-2">
            {restaurant?.restaurantName || "Not Found"}
          </h3>

          {/* Restaurant ID */}
          <div className="text-sm mb-4">ID: {restaurant?.restaurantId}</div>

          {/* Restaurant Type */}
          <span className="inline-block bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm mb-4">
            {restaurant?.restaurantType || "Not Found"}
          </span>

          {/* Owner Details */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Owner Details</h3>
            <div className="space-y-1 text-sm space-x-1">
              <span>👤 {restaurant?.ownerDetails?.name || "Not Found"}</span>
              <span>📧 {restaurant?.ownerDetails?.email || "Not Found"}</span>
              <span>📞 {restaurant?.ownerDetails?.phone || "Not Found"}</span>
            </div>
          </div>

          {/* Restaurant Address */}
          <div>
            <h3 className="text-lg font-medium mb-2">Restaurant Address</h3>
            <div className="text-sm">
              📍{" "}
              {[
                restaurant?.restaurantAddress?.street,
                restaurant?.restaurantAddress?.area,
                restaurant?.restaurantAddress?.city,
                restaurant?.restaurantAddress?.state,
                restaurant?.restaurantAddress?.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </div>
          </div>

          <div className="absolute bottom-2 right-4">
            🗓️{" "}
            {new Date(restaurant?.ownerDetails?.joinedAt).toLocaleDateString(
              "en-IN",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            ) || "Not Found"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllotedRestaurantsSectionComponent;
