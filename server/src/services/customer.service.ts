import { asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { customerTable } from "../db-schema";
import {
  CreateCustomerParams,
  GetDetailCustomerParams,
  GetListCustomerParams,
  UpdateCustomerParams,
} from "../models/customer.model";

export default class CustomerService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db.select({ count: count() }).from(customerTable);

    return result[0].count;
  }

  async getList(params: GetListCustomerParams) {
    const { sortBy, limit = 10, page = 1, name, phone } = params;

    const customerList = await this.db
      .select()
      .from(customerTable)
      .where(
        or(
          name ? like(customerTable.name, `%${name}%`) : undefined,
          phone ? like(customerTable.phone, `%${phone}%`) : undefined
        )
      )
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortBy === "asc"
          ? asc(customerTable.createdAt)
          : desc(customerTable.createdAt)
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(customerTable)
      .where(
        or(
          name ? like(customerTable.name, `%${name}%`) : undefined,
          phone ? like(customerTable.phone, `%${phone}%`) : undefined
        )
      );
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      data: customerList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getDetail(params: GetDetailCustomerParams) {
    const { id } = params;

    return await this.db.query.customerTable.findFirst({
      where: eq(customerTable.id, id),
    });
  }

  async create(params: CreateCustomerParams) {
    const results = await this.db
      .insert(customerTable)
      .values(params)
      .returning();

    return results[0];
  }

  async update(params: UpdateCustomerParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(customerTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(customerTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(customerTable)
      .where(eq(customerTable.id, id))
      .returning({ id: customerTable.id });

    return results[0];
  }
}
