import { asc, count, desc, eq, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { paymentTable } from "../db-schema";
import {
  CreatePaymentParams,
  GetDetailPaymentParams,
  GetListPaymentParams,
  UpdatePaymentParams,
} from "../models/payment.model";

export default class PaymentService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db.select({ count: count() }).from(paymentTable);

    return result[0].count;
  }

  async getList(params: GetListPaymentParams) {
    const { sortOrder, limit = 10, page = 1, status } = params;

    const paymentList = await this.db
      .select()
      .from(paymentTable)
      .where(or(status ? eq(paymentTable.status, status) : undefined))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(paymentTable.createdAt)
          : desc(paymentTable.createdAt)
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(paymentTable)
      .where(or(status ? eq(paymentTable.status, status) : undefined));
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      data: paymentList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getDetail(params: GetDetailPaymentParams) {
    const { id } = params;

    return await this.db.query.paymentTable.findFirst({
      where: eq(paymentTable.id, id),
    });
  }

  async create(params: CreatePaymentParams) {
    const results = await this.db
      .insert(paymentTable)
      .values(params)
      .returning();

    return results[0];
  }

  async update(params: UpdatePaymentParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(paymentTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(paymentTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(paymentTable)
      .where(eq(paymentTable.id, id))
      .returning({ id: paymentTable.id });

    return results[0];
  }
}
