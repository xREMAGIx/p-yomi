import { TagColor } from "@client/components/atoms/Tag";
import { OrderStatus, OrderStatusCode } from "@server/models/order.model";

export const handleConvertOrderStatusTag = (
  status: number
): { color: TagColor; label: string } => {
  const statusKey = OrderStatusCode[status] as keyof typeof OrderStatus;
  let color: TagColor;

  switch (statusKey) {
    case "UNPAID": {
      color = "radicalRed";
      break;
    }

    case "PARTIAL_PAID": {
      color = "coral";
      break;
    }

    default:
      color = "mayGreen";
      break;
  }

  return {
    color: color,
    label: OrderStatus[statusKey],
  };
};
