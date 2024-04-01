import Heading from "@client/components/atoms/Heading";
import Card from "@client/components/molecules/Card";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-home">
      <Heading>Welcome Home!</Heading>
      <div className="p-home_statictis u-m-t-32">
        <Card>
          <Heading type="h5" modifiers={["20x30"]}>
            Product
          </Heading>
        </Card>
      </div>
    </div>
  );
}
