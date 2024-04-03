import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/customer/$id')({
  component: () => <div>Hello /_authenticated/customer/$id!</div>
})