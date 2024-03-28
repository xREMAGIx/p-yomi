import Button from "@client/components/atoms/Button";
import Input from "@client/components/atoms/Input";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button>test</Button>
      <Input id="test" label="Test"></Input>
    </div>
  );
}
