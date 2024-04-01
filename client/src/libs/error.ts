import { UseNavigateResult } from "@tanstack/react-router";

export const handleCheckAuthError = (
  error: {
    status: unknown;
    value: unknown;
  } | null,
  navigate: UseNavigateResult<string>
) => {
  if (error?.status === 401) {
    navigate({ to: "/login", replace: true });
  }
};
