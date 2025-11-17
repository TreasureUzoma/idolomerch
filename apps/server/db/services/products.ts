import type {
  ProductsParams,
  ProductUpdateInput,
  ProductCreateInput,
} from "@workspace/validations";
import { and, desc, asc, eq, ilike, sql, or } from "drizzle-orm";
import { currencyConverter } from "./currency-converter";
import { products } from "../schema/products";
import { db } from "..";
import { paginate } from "../../utils/paginations";

const BASE_CURRENCY = "USD";

type ServiceResponse<T> = Promise<{
  data?: T;
  error?: string;
  status: "success" | "error";
}>;

type ProductCategory = (typeof products.category.enumValues)[number];

export const createProduct = async (
  body: ProductCreateInput
): ServiceResponse<typeof products.$inferSelect> => {
  try {
    const {
      price,
      costPrice,
      weight,
      currency: sourceCurrency = BASE_CURRENCY,
      category,
      dropDate,
      ...rest
    } = body;

    let finalSalePrice = Number(price);
    let finalCostPrice = Number(costPrice);

    let finalDropDate: Date | undefined;

    if (dropDate) {
      if (dropDate instanceof Date) {
        finalDropDate = dropDate;
      } else if (typeof dropDate === "string") {
        finalDropDate = new Date(dropDate);
      }
    }

    if (sourceCurrency !== BASE_CURRENCY) {
      const conversionRate = await currencyConverter.getRate(
        sourceCurrency,
        BASE_CURRENCY
      );
      finalSalePrice = finalSalePrice * conversionRate;
      finalCostPrice = finalCostPrice * conversionRate;
    }

    const inserted = await db
      .insert(products)
      .values({
        ...rest,
        category: category as ProductCategory,
        salePrice: finalSalePrice.toFixed(2),
        costPrice: finalCostPrice.toFixed(2),
        currency: BASE_CURRENCY,
        status: "active",
        dropDate: finalDropDate,
        weight: weight !== undefined ? String(weight) : undefined,
      })
      .returning();

    return { status: "success", data: inserted[0] };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product";
    return { status: "error", error: message };
  }
};

export const updateProduct = async (
  id: string,
  body: ProductUpdateInput
): ServiceResponse<typeof products.$inferSelect> => {
  try {
    const {
      price,
      costPrice,
      currency: sourceCurrency,
      category,
      dropDate,
      weight,
      ...rest
    } = body;

    let finalDropDate: Date | undefined;

    if (dropDate) {
      if (dropDate instanceof Date) {
        finalDropDate = dropDate;
      } else if (typeof dropDate === "string") {
        finalDropDate = new Date(dropDate);
      }
    }

    const updateData: Partial<typeof products.$inferInsert> = {
      ...rest,
      ...(category ? { category: category as ProductCategory } : {}),
      ...(dropDate !== undefined ? { dropDate: finalDropDate } : {}),
      ...(weight !== undefined ? { weight: String(weight) } : {}),
    };

    if (price !== undefined || costPrice !== undefined) {
      let conversionRate = 1;
      let currencyToUse = sourceCurrency || BASE_CURRENCY;

      if (currencyToUse !== BASE_CURRENCY) {
        conversionRate = await currencyConverter.getRate(
          currencyToUse,
          BASE_CURRENCY
        );
      }

      if (price !== undefined) {
        const finalSalePrice = Number(price) * conversionRate;
        updateData.salePrice = finalSalePrice.toFixed(2);
        updateData.currency = BASE_CURRENCY;
      }
      if (costPrice !== undefined) {
        const finalCostPrice = Number(costPrice) * conversionRate;
        updateData.costPrice = finalCostPrice.toFixed(2);
        updateData.currency = BASE_CURRENCY;
      }
    }

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (!updated || updated.length === 0) throw new Error("Product not found");

    return { status: "success", data: updated[0] };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update product";
    return { status: "error", error: message };
  }
};

export const deleteProduct = async (
  id: string
): ServiceResponse<{ id: string }> => {
  try {
    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });

    if (!deleted || deleted.length === 0) throw new Error("Product not found");

    return { status: "success", data: deleted[0] };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete product";
    return { status: "error", error: message };
  }
};

export const getProducts = async (
  params: ProductsParams,
  lookup?: { id?: string; slug?: string; isAdmin?: boolean }
): ServiceResponse<any> => {
  try {
    const {
      page = 1,
      limit = 15,
      search,
      category,
      sort = "newest",
      currency = BASE_CURRENCY,
    } = params;

    const isAdmin = lookup?.isAdmin || false;
    const isSingleLookup = lookup && (lookup.id || lookup.slug);

    const TARGET_CURRENCY = currency;
    const offset = isSingleLookup ? 0 : (page - 1) * limit;
    const finalLimit = isSingleLookup ? 1 : limit;

    const baseSelect = {
      id: products.id,
      mainImage: products.mainImage,
      galleryImages: products.galleryImages,
      name: products.name,
      slug: products.slug,
      price: products.salePrice,
      stockQuantity: products.stockQuantity,
      shortDescription: products.shortDescription,
      currency: products.currency,
      description: products.description,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: products.category,
      discountPercentage: products.discountPercentage,
      requiresShipping: products.requiresShipping,
      isFeatured: products.isFeatured,
    };

    const adminSelect = {
      ...baseSelect,
      costPrice: products.costPrice,
      sku: products.sku,
      barcode: products.barcode,
      status: products.status,
      visibility: products.visibility,
      inventoryTracking: products.inventoryTracking,
      lowStockThreshold: products.lowStockThreshold,
      dropDate: products.dropDate,
      weight: products.weight,
    };

    const selectFields = isAdmin ? adminSelect : baseSelect;

    const conditions = [];

    if (!isAdmin) {
      conditions.push(eq(products.status, "active"));
      conditions.push(eq(products.visibility, "public"));
    }

    if (lookup?.id || lookup?.slug) {
      const lookupConditions = [];
      if (lookup.id) lookupConditions.push(eq(products.id, lookup.id));
      if (lookup.slug) lookupConditions.push(eq(products.slug, lookup.slug));
      conditions.push(or(...lookupConditions));
    } else {
      if (search) conditions.push(ilike(products.name, `%${search}%`));
      if (category)
        conditions.push(eq(products.category, category as ProductCategory));
    }

    const orderBy =
      sort === "price-asc"
        ? asc(products.salePrice)
        : sort === "price-desc"
          ? desc(products.salePrice)
          : desc(products.createdAt);

    const finalConditions =
      conditions.length > 0 ? and(...conditions) : undefined;

    const dbQuery = db
      .select(selectFields)
      .from(products)
      .where(finalConditions)
      .orderBy(orderBy)
      .limit(finalLimit)
      .offset(offset);

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(finalConditions);

    const result = await paginate(dbQuery, countQuery, page, finalLimit);
    let productData = result.data || [];

    if (isSingleLookup && productData.length === 0) {
      throw new Error("Product not found");
    }

    if (TARGET_CURRENCY !== BASE_CURRENCY && productData.length > 0) {
      const conversionRate = await currencyConverter.getRate(
        BASE_CURRENCY,
        TARGET_CURRENCY
      );

      productData = productData.map((p: any) => {
        let finalPrice = p.price;
        if (p.price) {
          finalPrice = Math.round(Number(p.price) * conversionRate * 100) / 100;
        }
        return {
          ...p,
          price: finalPrice,
          currency: TARGET_CURRENCY,
        };
      });
    } else if (productData.length > 0) {
      productData = productData.map((p: any) => ({
        ...p,
        price: p.price ? Number(p.price) : p.price,
        currency: BASE_CURRENCY,
      }));
    }

    if (isSingleLookup) {
      return { status: "success", data: productData[0] };
    }

    result.data = productData;
    return { status: "success", data: result };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to retrieve products";
    return { status: "error", error: message };
  }
};
