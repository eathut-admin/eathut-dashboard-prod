import Image from "next/image";
import ErrorAnimation from "../loading-animations/Error-animation";
import PageLoadingAnimation from "../loading-animations/Page-loading-animation";
import {
  FaGift,
  FaTag,
  FaUser,
  FaMotorcycle,
  FaUtensils,
  FaShoppingCart,
  FaCreditCard,
  FaBox,
} from "react-icons/fa";

const ShowOrderDetails = ({
  orders,
  loading,
  error,
}: {
  orders: any;
  loading: boolean;
  error: string | null;
}) => {
  if (loading && !error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <PageLoadingAnimation />
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ErrorAnimation massage={error} />
      </div>
    );
  }

  return (
    <main className="min-h-full">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
        <CustomerDetails customerDetails={orders?.deliveryAddress} />
        {orders?.deliveryPartner &&
          Object.keys(orders?.deliveryPartner).length > 0 && (
            <DeliveryPartnerDetails riderDetails={orders?.deliveryPartner} />
          )}
        <RestaurantDetails restaurantDetails={orders?.restaurant} />
        {orders?.couponApplied &&
          Object.keys(orders?.couponApplied).length > 0 && (
            <CouponDetails couponDetails={orders?.couponApplied} />
          )}
        {orders?.offerApplied &&
          Object.keys(orders?.offerApplied).length > 0 && (
            <OfferDetails offerDetails={orders?.offerApplied} />
          )}
        <OrderDetails orders={orders} />
        <PaymentDetails orders={orders} />
        <OrderedItemsDetails orders={orders} />
      </section>
    </main>
  );
};

export default ShowOrderDetails;

const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center space-x-3">
    {icon && <span className="text-orange-500">{icon}</span>}
    <div className="flex flex-col">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  </div>
);

const CouponDetails = ({ couponDetails }: { couponDetails: any }) => {
  if (!couponDetails) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-orange-500 mb-7 flex items-center space-x-4">
        <FaTag />
        <span>Coupon Details</span>
      </h2>
      <div className="space-y-4">
        <DetailItem label="Coupon Code" value={couponDetails.code} />
        <DetailItem label="Coupon Type" value={couponDetails.type} />
        {couponDetails?.maxDiscountValue && (
          <DetailItem
            label="Max Discount Value"
            value={couponDetails?.maxDiscountValue}
          />
        )}
        {couponDetails?.minOrderValue && (
          <DetailItem
            label="Min Order Value"
            value={couponDetails?.minOrderValue}
          />
        )}
        <DetailItem
          label="Discount Value"
          value={`${couponDetails.discountValue}${
            couponDetails.discountType === "PERCENTAGE" ? "%" : "/-"
          }`}
        />
        <DetailItem
          label="Expires On"
          value={new Date(couponDetails.expiryDate).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        />
      </div>
    </div>
  );
};

const CustomerDetails = ({ customerDetails }: { customerDetails: any }) => {
  if (!customerDetails) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-orange-500 mb-7 flex items-center space-x-4">
        <FaUser />
        <span>Customer Details</span>
      </h2>
      <div className="space-y-4">
        <DetailItem label="Name" value={customerDetails.name} />
        <DetailItem label="Phone" value={`+91 ${customerDetails.phone}`} />
        <DetailItem label="Address" value={customerDetails.addressLine1} />
        {customerDetails.landmark && (
          <DetailItem label="Landmark" value={customerDetails.landmark} />
        )}
      </div>
    </div>
  );
};

const DeliveryPartnerDetails = ({ riderDetails }: { riderDetails: any }) => {
  if (!riderDetails) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-orange-500 mb-7 flex items-center space-x-4">
        <FaMotorcycle />
        <span>Delivery Partner Details</span>
      </h2>
      <div className="space-y-4">
        <DetailItem label="Rider Id" value={riderDetails?.deliveryPartnerId} />
        <DetailItem label="Name" value={riderDetails?.deliveryPartnerName} />
        <DetailItem
          label="Phone"
          value={`+91 ${riderDetails?.deliveryPartnerPhone}`}
        />
      </div>
    </div>
  );
};

const RestaurantDetails = ({
  restaurantDetails,
}: {
  restaurantDetails: any;
}) => {
  if (!restaurantDetails) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-orange-500 mb-7 flex items-center space-x-4">
        <FaUtensils />
        <span>Restaurant Details</span>
      </h2>
      <div className="space-y-4">
        <DetailItem
          label="Restaurant Name"
          value={restaurantDetails?.restaurantName}
        />
        <DetailItem label="Owner Name" value={restaurantDetails?.ownerName} />
        <DetailItem label="Phone" value={`+91 ${restaurantDetails?.phone}`} />
        <DetailItem label="Address" value={restaurantDetails?.address} />
      </div>
    </div>
  );
};

const OfferDetails = ({ offerDetails }: { offerDetails: any }) => {
  if (!offerDetails) return null;

  return (
    <div className="col-span-2">
      <h2 className="text-xl font-bold text-orange-500 mb-7 flex items-center space-x-4">
        <FaGift />
        <span>Offer Details</span>
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DetailItem label="Offer Title" value={offerDetails.title} />
          <DetailItem label="Offer ID" value={offerDetails.offerId} />
        </div>

        {offerDetails.description && (
          <DetailItem label="Description" value={offerDetails.description} />
        )}
        {offerDetails.offerType && (
          <DetailItem label="Offer Type" value={offerDetails.offerType} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DetailItem
            label="Valid From"
            value={new Date(offerDetails.validFrom).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          />
          <DetailItem
            label="Valid Till"
            value={new Date(offerDetails.validUntil).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          />
        </div>

        {offerDetails.minOrderAmount && (
          <DetailItem
            label="Minimum Order Amount"
            value={`₹ ${offerDetails.minOrderAmount}/-`}
          />
        )}

        {offerDetails?.freeItems?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <FaGift className="text-xl" />
              <span>Free Items</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offerDetails?.freeItems?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md grid grid-cols-2 gap-3">
                  <DetailItem label="Item Name" value={item?.name} />
                  <DetailItem label="Quantity" value={item?.quantity} />
                  <DetailItem label="Price" value={`₹${item?.price}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderDetails = ({ orders }: { orders: any }) => {
  if (!orders.orderStatus) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-orange-500 mb-7 flex items-center space-x-4">
        <FaShoppingCart />
        <span>Order Details</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailItem label="Order ID" value={orders.orderId} />
        <DetailItem label="Order Status" value={orders.orderStatus} />
        <DetailItem
          label="Order Date"
          value={new Date(orders.orderDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
        {orders?.deliveredAt && (
          <DetailItem
            label="Delivery Date"
            value={new Date(orders?.deliveredAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        )}
        {orders.cancelledAt && (
          <DetailItem
            label="Cancellation Date"
            value={new Date(orders.cancelledAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        )}
        {orders.cancellationReason && (
          <DetailItem
            label="Cancellation Reason"
            value={orders.cancellationReason}
          />
        )}
      </div>
    </div>
  );
};

const PaymentDetails = ({ orders }: { orders: any }) => {
  if (!orders.totalAmount) return null;

  return (
    <div className="col-span-2">
      <h2 className="text-xl font-bold text-orange-500 mb-7 flex items-center space-x-4">
        <FaCreditCard />
        <span>Payment Details</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailItem label="Payment Method" value={orders?.paymentMethod} />
        <DetailItem label="Payment Status" value={orders?.paymentStatus} />
        <DetailItem label="Sub Total" value={orders?.subtotal} />
        <DetailItem
          label="Total Amount (paid by customer)"
          value={orders?.totalAmount}
        />
        <DetailItem label="Discount" value={orders?.discount || "0.0"} />
        <DetailItem label="Delivery Fee" value={orders?.deliveryFee} />
        <DetailItem label="Tax" value={orders?.tax} />
      </div>
    </div>
  );
};

const OrderedItemsDetails = ({ orders }: { orders: any }) => {
  if (!orders?.items || orders?.items.length === 0) return null;

  return (
    <div className="col-span-3">
      <h2 className="text-xl font-bold text-orange-500 mb-7 flex items-center space-x-4">
        <FaBox />
        <span>Ordered Items Details</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders?.items?.map((item: any, index: number) => (
          <div key={index + Math.random()}>
            <div className="flex flex-col gap-3 border rounded-md min-h-full">
              <div className="bg-black w-full h-52 aspect-square rounded-md overflow-hidden relative">
                <Image
                  src={item?.food?.imageUrl || ""}
                  alt={item?.food?.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"></Image>
                <span className="absolute bottom-0 right-0 bg-[#fff] px-5 py-1 text-sm rounded-tl-md font-semibold text-black min-w-16">
                  ₹ {item?.price || "00.00"}{" "}
                  <span className="text-xs">(per pc)</span>
                </span>
              </div>
              <div className="p-3">
                <div className="flex justify-between text-base">
                  <p className="font-semibold">{item?.food?.name}</p>
                  <p>{item?.quantity} pcs</p>
                </div>

                <div className="mt-5 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">MRP</p>
                    <p className="text-sm font-semibold">
                      ₹ {item?.food?.price?.mrp || "00.00"}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Discount</p>
                    <p className="text-sm font-semibold">
                      {item?.food?.price?.discount || "00.00"} %
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Customer Price</p>
                    <p className="text-sm font-semibold">
                      ₹{" "}
                      {item?.food?.price?.customerPrice * item?.quantity ||
                        "00.00"}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Restaurant Share</p>
                    <p className="text-sm font-semibold">
                      ₹ {item?.food?.price?.restaurantShare || "00.00"}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Company Share</p>
                    <p className="text-sm font-semibold">
                      ₹ {item?.food?.price?.companyShare || "00.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
