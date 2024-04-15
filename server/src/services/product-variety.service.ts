import { asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { productVarietyTable } from "../db-schema";
import {
  CreateProductVarietyParams,
  GetDetailProductVarietyParams,
  GetListProductVarietyParams,
  UpdateProductVarietyParams,
} from "../models/product-variety.model";

export default class ProductVarietyService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db
      .select({ count: count() })
      .from(productVarietyTable);

    return result[0].count;
  }

  async getList(params: GetListProductVarietyParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, barcode, name } = params;

    const productList = await this.db
      .select()
      .from(productVarietyTable)
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(productVarietyTable[sortBy ?? "createdAt"])
          : desc(productVarietyTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(productVarietyTable);

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

  async getDetail(params: GetDetailProductVarietyParams) {
    const { id } = params;

    return await this.db.query.productVarietyTable.findFirst({
      where: eq(productVarietyTable.id, id),
    });
  }

  async create(params: CreateProductVarietyParams) {
    const results = await this.db
      .insert(productVarietyTable)
      .values(params)
      .returning();

    return results[0];
  }

  async update(params: UpdateProductVarietyParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(productVarietyTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(productVarietyTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(productVarietyTable)
      .where(eq(productVarietyTable.id, id))
      .returning({ id: productVarietyTable.id });

    return results[0];
  }
}
