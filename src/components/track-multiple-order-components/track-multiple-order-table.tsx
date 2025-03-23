import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

interface TableSectionProps {
  data: any;
  handleOrderClick: (orderId: string) => void;
}

const TrackMultipleOrderIdTable: React.FC<TableSectionProps> = ({
  data,
  handleOrderClick,
}) => {
  return (
    <Table className="">
      <TableHeader className="border">
        <TableRow>
          <TableHead className="text-[13.3px] text-black dark:text-white font-bold border-2 text-center">
            Order Id
          </TableHead>
          <TableHead className="text-[13.3px] text-black dark:text-white font-bold border-2">
            Customer
          </TableHead>
          <TableHead className="text-[13.3px] text-black dark:text-white font-bold border-2 text-center">
            Items
          </TableHead>
          <TableHead className="text-[13.3px] text-black dark:text-white font-bold border-2 text-center">
            Amount
          </TableHead>
          <TableHead className="text-[13.3px] text-black dark:text-white font-bold border-2 text-center">
            Status
          </TableHead>
          <TableHead className="text-[13.3px] text-black dark:text-white font-bold border-2 text-center">
            Restaurant Name
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((order: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium border-2 text-center">
                <Button
                  onClick={() => handleOrderClick(order.orderId)}
                  variant="secondary"
                  className={"px-5 w-36"}>
                  {order.orderId}
                </Button>
              </TableCell>
              <TableCell className="border-2">
                {order?.deliveryAddress?.name}
              </TableCell>
              <TableCell className="max-w-56 border-2 text-center">
                {order.items.length}
              </TableCell>
              <TableCell className="text-center border-2">
                {order.totalAmount}
              </TableCell>
              <TableCell className="text-center text-[12px] font-semibold border-2">
                {(() => {
                  switch (order.orderStatus) {
                    case "PENDING":
                      return (
                        <span className="bg-[#ffc107] text-[#000] py-0.5 px-1 rounded-md inline-block min-w-32">
                          {order.orderStatus}
                        </span>
                      );
                    case "ACCEPTED":
                      return (
                        <span className="bg-[#28a745] text-[#fff] py-0.5 px-1 rounded-md inline-block min-w-32">
                          {order.orderStatus}
                        </span>
                      );
                    case "PREPARING":
                      return (
                        <span className="bg-[#17a2b8] text-[#fff] py-0.5 px-1 rounded-md inline-block min-w-32">
                          {order.orderStatus}
                        </span>
                      );
                    case "OUT-FOR-DELIVERY":
                      return (
                        <span className="bg-[#007bff] text-[#fff] py-0.5 px-1 rounded-md inline-block min-w-32">
                          {order.orderStatus}
                        </span>
                      );
                    case "DELIVERED":
                      return (
                        <span className="bg-[#28a745] text-[#fff] py-0.5 px-1 rounded-md inline-block min-w-32">
                          {order.orderStatus}
                        </span>
                      );
                    case "CANCELLED":
                      return (
                        <span className="bg-[#dc3545] text-[#fff] py-0.5 px-1 rounded-md inline-block min-w-32">
                          {order.orderStatus}
                        </span>
                      );
                    case "REJECTED":
                      return (
                        <span className="bg-[#6c757d] text-[#fff] py-0.5 px-1 rounded-md inline-block min-w-32">
                          {order.orderStatus}
                        </span>
                      );
                    default:
                      return (
                        <span className="bg-[#6c757d] text-[#fff] py-0.5 px-1 rounded-md inline-block min-w-32">
                          {order.orderStatus}
                        </span>
                      );
                  }
                })()}
              </TableCell>
              <TableCell className="text-center border-2">
                {order.restaurant.restaurantName}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center border-2 py-8">
              No orders found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TrackMultipleOrderIdTable;
