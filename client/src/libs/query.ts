export const productQueryKeys = {
  all: ["product"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: ({
    page,
    search,
    sortBy,
    sortOrder,
  }: {
    page?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) =>
    [...productQueryKeys.lists(), { page, search, sortBy, sortOrder }] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...productQueryKeys.details(), id] as const,
  creates: () => [...productQueryKeys.all, "create"] as const,
  create: () => [...productQueryKeys.creates()] as const,
  updates: () => [...productQueryKeys.all, "update"] as const,
  update: (id: string | number) => [...productQueryKeys.updates(), id] as const,
  deletes: () => [...productQueryKeys.all, "delete"] as const,
  delete: () => [...productQueryKeys.deletes()] as const,
};

export const warehouseQueryKeys = {
  all: ["warehouse"] as const,
  lists: () => [...warehouseQueryKeys.all, "list"] as const,
  list: ({ page }: { page: number }) =>
    [...warehouseQueryKeys.lists(), { page }] as const,
  details: () => [...warehouseQueryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...warehouseQueryKeys.details(), id] as const,
  inventory: (id: string | number) =>
    [...warehouseQueryKeys.details(), "inventory", id] as const,
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
  delete: () => [...goodsReceiptQueryKeys.deletes()] as const,
  products: () => [...goodsReceiptQueryKeys.all, "product"] as const,
  searchProduct: () => [...goodsReceiptQueryKeys.products(), "search"] as const,
};

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  product: () => [...goodsReceiptQueryKeys.all, "product"] as const,
  inventory: () => [...goodsReceiptQueryKeys.all, "inventory"] as const,
};

export const inventoryQueryKeys = {
  all: ["dashboard"] as const,
  config: () => [...inventoryQueryKeys.all, "config"] as const,
  updateConfig: () => [...inventoryQueryKeys.config(), "update"] as const,
};

export const customerQueryKeys = {
  all: ["customer"] as const,
  lists: () => [...customerQueryKeys.all, "list"] as const,
  list: ({ page }: { page: number }) =>
    [...customerQueryKeys.lists(), { page }] as const,
  details: () => [...customerQueryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...customerQueryKeys.details(), id] as const,
  creates: () => [...customerQueryKeys.all, "create"] as const,
  create: () => [...customerQueryKeys.creates()] as const,
  updates: () => [...customerQueryKeys.all, "update"] as const,
  update: (id: string | number) =>
    [...customerQueryKeys.updates(), id] as const,
  deletes: () => [...customerQueryKeys.all, "delete"] as const,
  delete: () => [...customerQueryKeys.deletes()] as const,
};

export const orderQueryKeys = {
  all: ["order"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: ({ page }: { page: number }) =>
    [...orderQueryKeys.lists(), { page }] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...orderQueryKeys.details(), id] as const,
  creates: () => [...orderQueryKeys.all, "create"] as const,
  create: () => [...orderQueryKeys.creates()] as const,
  updates: () => [...orderQueryKeys.all, "update"] as const,
  update: (id: string | number) => [...orderQueryKeys.updates(), id] as const,
  deletes: () => [...orderQueryKeys.all, "delete"] as const,
  delete: () => [...orderQueryKeys.deletes()] as const,
  products: () => [...orderQueryKeys.all, "product"] as const,
  searchProduct: () => [...orderQueryKeys.products(), "search"] as const,
  customers: () => [...orderQueryKeys.all, "customer"] as const,
  searchCustomer: () => [...orderQueryKeys.customers(), "customer"] as const,
};
