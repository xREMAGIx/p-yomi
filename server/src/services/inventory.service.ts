import { asc, count, desc, eq, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { inventoryTable } from "../db-schema";
import { QueryPaginationParams } from "../models/base";
import {
  CreateInventoryParams,
  GetDetailInventoryParams,
  UpdateInventoryParams,
  UpdateStockInventoryParams,
} from "../models/inventory.model";

export default class InventoryService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const records = await this.db.select().from(inventoryTable);

    if (!records.length) return 0;

    return records.reduce((prev, curr) => prev + curr.quantityAvailable, 0);
  }

  async getList(params: QueryPaginationParams) {
    const { sortBy, limit = 10, page = 1 } = params;

    const inventoryList = await this.db.query.inventoryTable.findMany({
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortBy === "asc"
          ? [asc(inventoryTable.createdAt)]
          : [desc(inventoryTable.createdAt)],
    });

    const totalQueryResult = await this.db.execute(sql<{ count: string }>`
        SELECT count(*) FROM ${inventoryTable};
    `);
    const total = Number(totalQueryResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    return {
      data: inventoryList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getDetail(params: GetDetailInventoryParams) {
    const { id } = params;

    return await this.db.query.inventoryTable.findFirst({
      where: eq(inventoryTable.id, id),
    });
  }

  async create(params: CreateInventoryParams) {
    const results = await this.db
      .insert(inventoryTable)
      .values(params)
      .returning();

    return results[0];
  }

  async update(params: UpdateInventoryParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(inventoryTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(inventoryTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(inventoryTable)
      .where(eq(inventoryTable.id, id))
      .returning({ id: inventoryTable.id });

    return results[0];
  }

  async updateStock(params: UpdateStockInventoryParams) {
    const { warehouseId, products } = params;

    const existedRecords = await this.db
      .select()
      .from(inventoryTable)
      .where(eq(inventoryTable.warehouseId, warehouseId));

    await Promise.all(
      products.map(async (product) => {
        const existedIdx = existedRecords.findIndex(
          (ele) => ele.productId === product.productId
        );

        if (existedIdx === -1) {
          await this.db.insert(inventoryTable).values({
            warehouseId: warehouseId,
            productId: product.productId,
            quantityAvailable: product.quantity,
          });
          return;
        }

        await this.db
          .update(inventoryTable)
          .set({
            quantityAvailable:
              existedRecords[existedIdx].quantityAvailable +
              (product.quantity ?? 0),
          })
          .where(eq(inventoryTable.id, existedRecords[existedIdx].id));
      })
    );
  }
}
