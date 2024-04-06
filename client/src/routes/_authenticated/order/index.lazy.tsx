import Button from "@client/components/atoms/Button";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/order/")({
  component: OrderList,
});

function OrderList() {
  //* Hooks
  const navigate = useNavigate();

  return (
    <div className="p-orderList">
      <Button
        modifiers={["inline"]}
        onClick={() => navigate({ to: "/order/create" })}
      >
        Create
      </Button>
    </div>
  );
}
