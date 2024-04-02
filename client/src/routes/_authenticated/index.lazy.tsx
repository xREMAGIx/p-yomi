import Heading from "@client/components/atoms/Heading";
import Text from "@client/components/atoms/Text";
import Card from "@client/components/molecules/Card";
import { handleCheckAuthError } from "@client/libs/error";
import { dashboardQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/")({
  component: Index,
});

function Index() {
  //* Hooks
  const navigate = useNavigate();

  //* Query
  const { data: productData } = useQuery({
    queryKey: dashboardQueryKeys.product(),
    queryFn: async () => {
      const { data, error } = await server.api.v1.dashboard.product.get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      return data;
    },
  });

  const { data: inventoryData } = useQuery({
    queryKey: dashboardQueryKeys.inventory(),
    queryFn: async () => {
      const { data, error } = await server.api.v1.dashboard.inventory.get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      return data;
    },
  });

  return (
    <div className="p-home">
      <Heading>Welcome Home!</Heading>
      <div className="p-home_statictis u-m-t-32">
        <Card>
          <Heading type="h5" modifiers={["24x32"]}>
            Product
          </Heading>
          <Text>{productData?.total}</Text>
        </Card>
        <Card>
          <Heading type="h5" modifiers={["24x32"]}>
            Inventory
          </Heading>
          <Text>{inventoryData?.total}</Text>
        </Card>
      </div>
    </div>
  );
}
