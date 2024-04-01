import { asc, desc, eq, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { goodsReceiptTable } from "../db-schema";
import { QueryPaginationParams } from "../models/base";
import {
  CreateGoodsReceiptParams,
  GetDetailGoodsReceiptParams,
  UpdateGoodsReceiptParams,
} from "../models/goods-receipt.model";

export default class GoodsReceiptService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getList(params: QueryPaginationParams) {
    const { sortBy, limit = 10, page = 1 } = params;

    const goodsReceiptList = await this.db.query.goodsReceiptTable.findMany({
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortBy === "asc"
          ? [asc(goodsReceiptTable.createdAt)]
          : [desc(goodsReceiptTable.createdAt)],
    });

    const totalQueryResult = await this.db.execute(sql<{ count: string }>`
        SELECT count(*) FROM ${goodsReceiptTable};
    `);
    const total = Number(totalQueryResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    return {
      data: goodsReceiptList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getDetail(params: GetDetailGoodsReceiptParams) {
    const { id } = params;

    return await this.db.query.goodsReceiptTable.findFirst({
      where: eq(goodsReceiptTable.id, id),
    });
  }

  async create(params: CreateGoodsReceiptParams) {
    const results = await this.db
      .insert(goodsReceiptTable)
      .values(params)
      .returning();

    return results[0];
  }

  async update(params: UpdateGoodsReceiptParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(goodsReceiptTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(goodsReceiptTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(goodsReceiptTable)
      .where(eq(goodsReceiptTable.id, id))
      .returning({ id: goodsReceiptTable.id });

    return results[0];
  }
}
