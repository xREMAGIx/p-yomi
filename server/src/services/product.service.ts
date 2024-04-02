import { and, asc, count, desc, eq, like, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { productTable } from "../db-schema";
import {
  CreateProductParams,
  GetDetailProductParams,
  GetListProductParams,
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
    const { sortBy, limit = 10, page = 1, barcode, name } = params;

    const productList = await this.db
      .select()
      .from(productTable)
      .where(
        and(
          barcode ? like(productTable.barcode, `%${barcode}%`) : undefined,
          name ? like(productTable.name, name) : undefined
        )
      )
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortBy === "asc"
          ? asc(productTable.createdAt)
          : desc(productTable.createdAt)
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(productTable)
      .where(
        and(
          barcode ? like(productTable.barcode, `%${barcode}%`) : undefined,
          name ? like(productTable.name, name) : undefined
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
}
