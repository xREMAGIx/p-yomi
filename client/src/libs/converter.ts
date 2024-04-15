import { TagColor } from "@client/components/atoms/Tag";
import { OrderStatus, OrderStatusCode } from "@server/models/order.model";
import { ProductStatus, ProductStatusCode } from "@server/models/product.model";

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

export const handleConvertProductStatusTag = (
  status: number
): { color: TagColor; label: string } => {
  const statusKey = ProductStatusCode[status] as keyof typeof ProductStatus;
  let color: TagColor;

  switch (statusKey) {
    case "END_OF_SERVICE": {
      color = "radicalRed";
      break;
    }

    case "DRAFT": {
      color = "coral";
      break;
    }

    default:
      color = "mayGreen";
      break;
  }

  return {
    color: color,
    label: ProductStatus[statusKey],
  };
};
