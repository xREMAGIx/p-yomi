import { asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { warehouseTable } from "../db-schema";
import {
  CreateWarehouseParams,
  GetDetailWarehouseParams,
  GetListWarehouseParams,
  UpdateWarehouseParams,
} from "../models/warehouse.model";

export default class WarehouseService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getList(params: GetListWarehouseParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, name } = params;

    const warehouseList = await this.db
      .select()
      .from(warehouseTable)
      .where(or(name ? like(warehouseTable.name, `%${name}%`) : undefined))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(warehouseTable[sortBy ?? "createdAt"])
          : desc(warehouseTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(warehouseTable)
      .where(or(name ? like(warehouseTable.name, `%${name}%`) : undefined));
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      data: warehouseList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getDetail(params: GetDetailWarehouseParams) {
    const { id } = params;

    return await this.db.query.warehouseTable.findFirst({
      where: eq(warehouseTable.id, id),
    });
  }

  async create(params: CreateWarehouseParams) {
    const results = await this.db
      .insert(warehouseTable)
      .values(params)
      .returning();

    return results[0];
  }

  async update(params: UpdateWarehouseParams) {
    const { id, ...rest } = params;

    const results = await this.db
      .update(warehouseTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(warehouseTable.id, id))
      .returning();

    return results[0];
  }

  async delete(id: number) {
    const results = await this.db
      .delete(warehouseTable)
      .where(eq(warehouseTable.id, id))
      .returning({ id: warehouseTable.id });

    return results[0];
  }
}
