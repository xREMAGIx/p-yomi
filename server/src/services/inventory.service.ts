import { asc, count, desc, eq, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { inventoryTable, productTable } from "../db-schema";
import { InvalidContentError } from "../libs/error";
import {
  CreateStockInventoryParams,
  DeleteStockInventoryParams,
  GetStockInWarehouseParams,
  UpdateInventoryConfigParams,
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

  async createStock(params: CreateStockInventoryParams) {
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
            updatedAt: sql`now()`,
          })
          .where(eq(inventoryTable.id, existedRecords[existedIdx].id));
      })
    );
  }

  async deleteStock(params: DeleteStockInventoryParams) {
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
          throw new InvalidContentError("Invalid product!");
        }

        await this.db
          .update(inventoryTable)
          .set({
            quantityAvailable:
              existedRecords[existedIdx].quantityAvailable -
              (product.quantity ?? 0),
          })
          .where(eq(inventoryTable.id, existedRecords[existedIdx].id));
      })
    );
  }

  async getStockInWarehouse(params: GetStockInWarehouseParams) {
    const { warehouseId, sortOrder, limit = 10, page = 1 } = params;

    const records = await this.db
      .select()
      .from(inventoryTable)
      .where(eq(inventoryTable.warehouseId, warehouseId))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(inventoryTable.createdAt)
          : desc(inventoryTable.createdAt)
      )
      .leftJoin(productTable, eq(inventoryTable.productId, productTable.id));

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(inventoryTable)
      .where(eq(inventoryTable.warehouseId, warehouseId));

    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    const results = records.map((ele) => ({
      ...ele.inventory,
      product: ele.product,
    }));

    return {
      data: results,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async updateConfig(params: UpdateInventoryConfigParams) {
    const { configs } = params;

    await Promise.all(
      configs.map(async (config) => {
        await this.db
          .update(inventoryTable)
          .set({
            minimumStockLevel: config.minimumStockLevel,
            maximumStockLevel: config.maximumStockLevel,
            reorderPoint: config.reorderPoint,
          })
          .where(eq(inventoryTable.id, config.id));
      })
    );
  }

  async useStock(params: UpdateStockInventoryParams) {
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
              existedRecords[existedIdx].quantityAvailable -
              (product.quantity ?? 0),
            updatedAt: sql`now()`,
          })
          .where(eq(inventoryTable.id, existedRecords[existedIdx].id));
      })
    );
  }
}
