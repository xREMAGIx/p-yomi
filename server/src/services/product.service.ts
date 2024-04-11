import { asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { inventoryTable, productTable, warehouseTable } from "../db-schema";
import {
  CreateProductParams,
  GetDetailProductParams,
  GetListProductParams,
  GetListProductWithInventoryParams,
  ProductWithInventoryData,
  UpdateProductParams,
} from "../models/product.model";

export default class ProductService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db.select({ count: count() }).from(productTable);

    return result[0].count;
  }

  async getList(params: GetListProductParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, barcode, name } = params;

    const productList = await this.db
      .select()
      .from(productTable)
      .where(
        or(
          barcode ? like(productTable.barcode, `%${barcode}%`) : undefined,
          name ? like(productTable.name, `%${name}%`) : undefined
        )
      )
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(productTable[sortBy ?? "createdAt"])
          : desc(productTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(productTable)
      .where(
        or(
          barcode ? like(productTable.barcode, `%${barcode}%`) : undefined,
          name ? like(productTable.name, `%${name}%`) : undefined
        )
      );

    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      data: productList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getDetail(params: GetDetailProductParams) {
    const { id } = params;

    return await this.db.query.productTable.findFirst({
      where: eq(productTable.id, id),
    });
  }

  async create(params: CreateProductParams) {
    const results = await this.db
      .insert(productTable)
      .values(params)
      .returning();

    return results[0];
  }

  async update(params: UpdateProductParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(productTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(productTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(productTable)
      .where(eq(productTable.id, id))
      .returning({ id: productTable.id });

    return results[0];
  }

  async getListWithInventory(params: GetListProductWithInventoryParams) {
    const { sortOrder, limit = 10, page = 1, barcode, name } = params;

    const records = await this.db
      .select()
      .from(productTable)
      .where(
        or(
          barcode ? like(productTable.barcode, `%${barcode}%`) : undefined,
          name ? like(productTable.name, `%${name}%`) : undefined
        )
      )
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(productTable.createdAt)
          : desc(productTable.createdAt)
      )
      .leftJoin(inventoryTable, eq(inventoryTable.productId, productTable.id))
      .leftJoin(
        warehouseTable,
        eq(warehouseTable.id, inventoryTable.warehouseId)
      );

    const results = records.reduce((prev: ProductWithInventoryData[], curr) => {
      const { product, inventory, warehouse } = curr;

      const existedRecordIdx = prev.findIndex((ele) => ele.id === product.id);

      if (existedRecordIdx > -1) {
        const modifyList = [...prev];
        modifyList[existedRecordIdx] = {
          ...modifyList[existedRecordIdx],
          totalAvailable: modifyList[existedRecordIdx].totalAvailable ?? 0,
          inventory: [
            ...modifyList[existedRecordIdx].inventory,
            {
              quantityAvailable: inventory?.quantityAvailable ?? 0,
              warehouseId: inventory?.warehouseId ?? -1,
              warehouseName: warehouse?.name ?? "",
            },
          ],
        };
        return modifyList;
      }

      return [
        ...prev,
        {
          ...product,
          totalAvailable: inventory?.quantityAvailable ?? 0,
          inventory: [
            {
              quantityAvailable: inventory?.quantityAvailable ?? 0,
              warehouseId: inventory?.warehouseId ?? -1,
              warehouseName: warehouse?.name ?? "",
            },
          ],
        },
      ];
    }, []);

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(productTable)
      .where(
        or(
          barcode ? like(productTable.barcode, `%${barcode}%`) : undefined,
          name ? like(productTable.name, `%${name}%`) : undefined
        )
      );

    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

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
}
