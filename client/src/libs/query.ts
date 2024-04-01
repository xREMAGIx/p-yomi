export const productQueryKeys = {
  all: ["product"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: ({ page }: { page: number }) =>
    [...productQueryKeys.lists(), { page }] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...productQueryKeys.details(), id] as const,
  creates: () => [...productQueryKeys.all, "create"] as const,
  create: () => [...productQueryKeys.creates()] as const,
  updates: () => [...productQueryKeys.all, "update"] as const,
  update: (id: string | number) => [...productQueryKeys.updates(), id] as const,
  deletes: () => [...productQueryKeys.all, "delete"] as const,
  delete: (id: string | number) => [...productQueryKeys.deletes(), id] as const,
};

export const warehouseQueryKeys = {
  all: ["warehouse"] as const,
  lists: () => [...warehouseQueryKeys.all, "list"] as const,
  list: ({ page }: { page: number }) =>
    [...warehouseQueryKeys.lists(), { page }] as const,
  details: () => [...warehouseQueryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...warehouseQueryKeys.details(), id] as const,
  creates: () => [...warehouseQueryKeys.all, "create"] as const,
  create: () => [...warehouseQueryKeys.creates()] as const,
  updates: () => [...warehouseQueryKeys.all, "update"] as const,
  update: (id: string | number) =>
    [...warehouseQueryKeys.updates(), id] as const,
  deletes: () => [...warehouseQueryKeys.all, "delete"] as const,
  delete: (id: string | number) =>
    [...warehouseQueryKeys.deletes(), id] as const,
};

export const goodsReceiptQueryKeys = {
  all: ["goodsReceipt"] as const,
  lists: () => [...goodsReceiptQueryKeys.all, "list"] as const,
  list: ({ page }: { page: number }) =>
    [...goodsReceiptQueryKeys.lists(), { page }] as const,
  details: () => [...goodsReceiptQueryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...goodsReceiptQueryKeys.details(), id] as const,
  creates: () => [...goodsReceiptQueryKeys.all, "create"] as const,
  create: () => [...goodsReceiptQueryKeys.creates()] as const,
  updates: () => [...goodsReceiptQueryKeys.all, "update"] as const,
  update: (id: string | number) =>
    [...goodsReceiptQueryKeys.updates(), id] as const,
  deletes: () => [...goodsReceiptQueryKeys.all, "delete"] as const,
  delete: (id: string | number) =>
    [...goodsReceiptQueryKeys.deletes(), id] as const,
};
