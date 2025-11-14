import type { ProductsParams } from "@workspace/validations";
import { products } from "../schema/products";
import { db } from "..";
import { and, desc, asc, eq, ilike, sql } from "drizzle-orm";
import { paginate } from "../../utils/paginations";
import { currencyConverter } from "../services/currency-converter";

export const getAllProducts = async (params: ProductsParams) => {
  const {
    page = 1,
    limit = 15,
    search,
    category,
    sort = "newest",
    currency = "USD",
  } = params;

  const offset = (page - 1) * limit;

  const conditions = [
    eq(products.status, "active"),
    eq(products.visibility, "public"),
  ];

  if (search) conditions.push(ilike(products.name, `%${search}%`));
  if (category) conditions.push(eq(products.category, category));

  const orderBy =
    sort === "price-asc"
      ? asc(products.salePrice)
      : sort === "price-desc"
        ? desc(products.salePrice)
        : desc(products.createdAt);

  const dbQuery = db
    .select({
      name: products.name,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      price: products.salePrice,
      discount: products.discountPercentage,
      stockQuantity: products.stockQuantity,
      slug: products.slug,
      shortDescription: products.shortDescription,
      currency: products.currency,
    })
    .from(products)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(and(...conditions));

  const result = await paginate(dbQuery, countQuery, page, limit);

  if (!result.data) result.data = [];

  const BASE_CURRENCY = "USD";
  const TARGET_CURRENCY = currency;

  if (TARGET_CURRENCY !== BASE_CURRENCY) {
    const conversionRate = await currencyConverter.getRate(
      BASE_CURRENCY,
      TARGET_CURRENCY
    );

    result.data = result.data.map((p: any) => ({
      ...p,
      price: p.price ? (Number(p.price) * conversionRate).toFixed(2) : p.price,
      currency: TARGET_CURRENCY,
    }));
  }

  return result;
};

export const getProductBySlugOrId = async (payload: {
  slug?: string;
  id?: string;
  currency: string;
}) => {
  const { slug, id, currency } = payload;

  if (!slug && !id) throw new Error("Product slug or ID is required");

  let product: any | null = null;

  const selectFields = {
    id: products.id,
    name: products.name,
    slug: products.slug,
    price: products.salePrice,
    discount: products.discountPercentage,
    stockQuantity: products.stockQuantity,
    shortDescription: products.shortDescription,
    currency: products.currency,
    createdAt: products.createdAt,
    updatedAt: products.updatedAt,
  };

  if (slug) {
    product = await db
      .select(selectFields)
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1)
      .then((res) => res[0] || null);
  } else if (id) {
    product = await db
      .select(selectFields)
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
      .then((res) => res[0] || null);
  }

  if (!product) throw new Error("Product not found");

  const SOURCE_CURRENCY = product.currency || "USD";
  const TARGET_CURRENCY = currency;

  if (TARGET_CURRENCY !== SOURCE_CURRENCY) {
    const conversionRate = await currencyConverter.getRate(
      SOURCE_CURRENCY,
      TARGET_CURRENCY
    );

    product.price = product.price
      ? (Number(product.price) * conversionRate).toFixed(2)
      : product.price;

    product.currency = TARGET_CURRENCY;
  } else if (product.price) {
    product.price = Number(product.price).toFixed(2);
  }

  return { data: [product] };
};
