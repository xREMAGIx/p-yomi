import { asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { orderDetailTable, orderTable } from "../db-schema";
import {
  CreateOrderParams,
  GetDetailOrderParams,
  GetListOrderParams,
  OrderStatusCode,
  UpdateOrderParams,
} from "../models/order.model";

export default class OrderService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  handleOrderStatus(paid?: number, due?: number) {
    if ((due ?? 0) === 0 && (paid ?? 0) > 0) {
      return OrderStatusCode.PAID;
    }

    if ((due ?? 0) > 0 && (paid ?? 0) > 0) {
      return OrderStatusCode.PARTIAL_PAID;
    }

    return OrderStatusCode.UNPAID;
  }

  async getTotal() {
    const result = await this.db.select({ count: count() }).from(orderTable);

    return result[0].count;
  }

  async getList(params: GetListOrderParams) {
    const { sortBy, limit = 10, page = 1, customerPhone } = params;

    const orderList = await this.db
      .select()
      .from(orderTable)
      .where(
        or(
          customerPhone
            ? like(orderTable.customerPhone, `%${customerPhone}%`)
            : undefined
        )
      )
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortBy === "asc"
          ? asc(orderTable.createdAt)
          : desc(orderTable.createdAt)
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(orderTable)
      .where(
        or(
          customerPhone
            ? like(orderTable.customerPhone, `%${customerPhone}%`)
            : undefined
        )
      );
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      data: orderList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getDetail(params: GetDetailOrderParams) {
    const { id } = params;

    return await this.db.query.orderTable.findFirst({
      where: eq(orderTable.id, id),
    });
  }

  async create(params: CreateOrderParams) {
    const { products, warehouseId, payment, ...orderParams } = params;
    const orderResults = await this.db
      .insert(orderTable)
      .values({
        ...orderParams,
        warehouseId,
        status: this.handleOrderStatus(orderParams.paid, orderParams.due),
      })
      .returning();

    await this.db.insert(orderDetailTable).values(
      products.map((ele) => ({
        orderId: orderResults[0].id,
        productId: ele.productId,
        discount: ele.discount,
        quantity: ele.quantity,
      }))
    );

    return orderResults[0];
  }

  async update(params: UpdateOrderParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(orderTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(orderTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(orderTable)
      .where(eq(orderTable.id, id))
      .returning({ id: orderTable.id });

    return results[0];
  }
}
