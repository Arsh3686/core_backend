import type {
  BuildDynamicQueryParams,
  defaultResponseType,
} from "@core/core-types.js";
import { DatabaseError } from "@core/errors/BasicError.js";
import type { Knex } from "knex";

const buildDynamicQuery = async (
  knex: Knex,
  {
    table,
    alias = null,
    select = ["*"],
    joins = [],
    where = {},
    whereRaw = "",
    whereIn = {},
    whereBetween = {},
    orderBy = [],
    limit = null,
    offset = null,
  }: BuildDynamicQueryParams,
  isSingleResponse = false
): Promise<defaultResponseType> => {
  try {
    if (!table) throw new Error("Table name required");

    const base = alias ? `${table} as ${alias}` : table;
    const query = knex(base).select(select);

    // -----------------------------
    //  JOINS (industry pattern)
    // -----------------------------
    joins.forEach((j) => {
      const { type = "inner", table, on } = j as any;

      if (!table || !on) return;

      if (type === "inner") query.join(table, on[0], on[1]);
      else if (type === "left") query.leftJoin(table, on[0], on[1]);
      else if (type === "right") query.rightJoin(table, on[0], on[1]);
      else if (type === "raw") query.joinRaw(j.raw);
    });

    // -----------------------------
    // SIMPLE WHERE
    // -----------------------------
    Object.entries(where).forEach(([key, value]) => {
      if (value !== undefined && value !== null) query.where(key, value);
    });

    // -----------------------------
    // RAW WHERE
    // -----------------------------
    if (whereRaw) {
      query.whereRaw(whereRaw);
    }

    // -----------------------------
    // WHERE IN
    // -----------------------------
    Object.entries(whereIn).forEach(([key, arr]) => {
      if (Array.isArray(arr) && arr.length) query.whereIn(key, arr);
    });

    // -----------------------------
    // WHERE BETWEEN
    // -----------------------------
    Object.entries(whereBetween).forEach(([key, range]) => {
      if (Array.isArray(range) && range.length === 2)
        query.whereBetween(key, range);
    });

    // -----------------------------
    // ORDER BY
    // -----------------------------
    orderBy.forEach((o) => {
      query.orderBy(o.column, o.direction || "asc");
    });

    // -----------------------------
    // LIMIT / OFFSET
    // -----------------------------
    if (limit) query.limit(limit);
    if (offset) query.offset(offset);

    const result = await query;
    if (isSingleResponse) {
      return { data: result[0] };
    }
    return { data: result };
  } catch (error) {
    throw new DatabaseError("Error while building dynamic query", error, "DBError");
  }
};

export { buildDynamicQuery };
