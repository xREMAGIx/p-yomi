import { asc, desc, eq, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import {
  goodsReceiptDetailTable,
  goodsReceiptTable,
  productTable,
  warehouseTable,
} from "../db-schema";
import { QueryPaginationParams } from "../models/base";
import {
  CreateGoodsReceiptParams,
  GetDetailGoodsReceiptParams,
  GoodsReceiptData,
  GoodsReceiptDetailData,
  GoodsReceiptProductData,
  UpdateGoodsReceiptParams,
} from "../models/goods-receipt.model";

export default class GoodsReceiptService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getList(params: QueryPaginationParams) {
    const { sortBy, limit = 10, page = 1 } = params;

    const goodsReceiptResult = await this.db
      .select()
      .from(goodsReceiptTable)
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortBy === "asc"
          ? asc(goodsReceiptTable.createdAt)
          : desc(goodsReceiptTable.createdAt)
      )
      .leftJoin(
        warehouseTable,
        eq(goodsReceiptTable.warehouseId, warehouseTable.id)
      );

    const goodsReceiptList = goodsReceiptResult.reduce(
      (prev: GoodsReceiptData[], curr) => {
        const { warehouse, goods_receipt } = curr;
        const { warehouseId, ...rest } = goods_receipt;

        return [
          ...prev,
          {
            ...rest,
            warehouse,
          },
        ];
      },
      []
    );

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

    const goodsReceiptResult = await this.db
      .select()
      .from(goodsReceiptTable)
      .where(eq(goodsReceiptTable.id, id))
      .leftJoin(
        warehouseTable,
        eq(goodsReceiptTable.warehouseId, warehouseTable.id)
      );

    const goodsReceiptDetailResult = await this.db
      .select()
      .from(goodsReceiptDetailTable)
      .where(eq(goodsReceiptDetailTable.goodsReceiptId, id))
      .leftJoin(
        productTable,
        eq(goodsReceiptDetailTable.productId, productTable.id)
      );

    const goodsReceiptList = goodsReceiptResult.reduce(
      (prev: GoodsReceiptDetailData[], curr) => {
        const { warehouse, goods_receipt } = curr;
        const { warehouseId, ...rest } = goods_receipt;

        if (!warehouse) return prev;

        const goodsReceiptDetail = goodsReceiptDetailResult.reduce(
          (innerPrev: GoodsReceiptProductData[], curr) => {
            const { product, goods_receipt_detail } = curr;
            const { quantity } = goods_receipt_detail;

            if (!product) return [...innerPrev];

            return [
              ...innerPrev,
              {
                ...product,
                quantity,
              },
            ];
          },
          []
        );

        return [
          ...prev,
          {
            ...rest,
            warehouse,
            products: goodsReceiptDetail,
          },
        ];
      },
      []
    );

    return {
      goodsReceipt: goodsReceiptList[0],
    };
  }

  async create(params: CreateGoodsReceiptParams) {
    const { warehouseId, products } = params;
    const goodsReceiptResults = await this.db
      .insert(goodsReceiptTable)
      .values({ warehouseId })
      .returning();

    await this.db.insert(goodsReceiptDetailTable).values(
      products.map((ele) => ({
        goodsReceiptId: goodsReceiptResults[0].id,
        productId: ele.productId,
        quantity: ele.quantity ?? 0,
      }))
    );

    return goodsReceiptResults[0];
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
