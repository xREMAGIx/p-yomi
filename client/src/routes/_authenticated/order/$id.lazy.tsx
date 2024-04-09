import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/order/$id')({
  component: () => <div>Hello /_authenticated/order/$id!</div>
})