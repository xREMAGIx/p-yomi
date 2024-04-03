import { and, asc, desc, eq, sql } from "drizzle-orm";
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
    const { id, warehouseId, products } = params;

    await this.db
      .update(goodsReceiptTable)
      .set({
        updatedAt: sql`now()`,
      })
      .where(eq(goodsReceiptTable.id, id));

    const existedRecords = await this.db
      .select()
      .from(goodsReceiptDetailTable)
      .where(eq(goodsReceiptDetailTable.goodsReceiptId, id));

    const modifiedProducts = await Promise.all(
      products.map(async (product) => {
        const existedIdx = existedRecords.findIndex(
          (ele) => ele.productId === product.productId
        );

        //* If not exist -> Add
        if (existedIdx === -1) {
          await this.db.insert(goodsReceiptDetailTable).values({
            goodsReceiptId: id,
            productId: product.productId,
            quantity: product.quantity ?? 0,
          });
          return product;
        }

        //* If exist -> update
        await this.db
          .update(goodsReceiptDetailTable)
          .set({
            quantity: product.quantity,
            updatedAt: sql`now()`,
          })
          .where(
            and(
              eq(goodsReceiptDetailTable.goodsReceiptId, id),
              eq(goodsReceiptDetailTable.productId, product.productId)
            )
          );

        //* Check if any product has been delete -> update
        if (existedRecords.length > products.length) {
          const deletedProduct = existedRecords.filter(
            (ele) => ele.productId !== product.productId
          );

          await Promise.all(
            deletedProduct.map(async (ele) => {
              await this.db
                .delete(goodsReceiptDetailTable)
                .where(
                  and(
                    eq(goodsReceiptDetailTable.goodsReceiptId, id),
                    eq(goodsReceiptDetailTable.productId, ele.productId)
                  )
                );
            })
          );

          return {
            productId: product.productId,
            quantity: -existedRecords[existedIdx].quantity,
          };
        }

        return {
          productId: product.productId,
          quantity:
            (product.quantity ?? 0) - existedRecords[existedIdx].quantity,
        };
      })
    );

    return {
      warehouseId,
      modifiedProducts,
    };
  }

  async delete(id: number) {
    const deleteDetailResults = await this.db
      .delete(goodsReceiptDetailTable)
      .where(eq(goodsReceiptDetailTable.goodsReceiptId, id))
      .returning();

    const deleteResults = await this.db
      .delete(goodsReceiptTable)
      .where(eq(goodsReceiptTable.id, id))
      .returning();

    const products = deleteDetailResults.map((ele) => ({
      productId: ele.productId,
      quantity: ele.quantity,
    }));

    return {
      warehouseId: deleteResults[0].warehouseId,
      products,
    };
  }
}
