import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/customer/create')({
  component: () => <div>Hello /_authenticated/customer/create!</div>
})