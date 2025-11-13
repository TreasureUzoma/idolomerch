import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import {
  currencyEnum,
  productCategoryEnum,
  productStatusEnum,
  visibilityEnum,
} from "./enums";

export const products = pgTable("products", {
  serial: serial("serial").primaryKey(),
  id: uuid("id").defaultRandom().notNull().unique(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),

  status: productStatusEnum("status").notNull().default("draft"),
  visibility: visibilityEnum("visibility").notNull().default("private"),
  category: productCategoryEnum("category").notNull(),

  sku: text("sku").notNull().unique(),
  barcode: text("barcode"),

  currency: currencyEnum("currency").notNull().default("USD"),
  costPrice: numeric("cost_price", { precision: 12, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
  discountPercentage: integer("discount_percentage").default(0),

  stockQuantity: integer("stock_quantity").notNull().default(0),
  inventoryTracking: boolean("inventory_tracking").notNull().default(true),
  lowStockThreshold: integer("low_stock_threshold").default(5),

  sizes:
    jsonb("sizes").$type<
      ("XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "ONE_SIZE" | "CUSTOM")[]
    >(),
  color: text("color"),
  limitedEdition: boolean("limited_edition").notNull().default(false),
  dropDate: timestamp("drop_date"),

  weight: numeric("weight", { precision: 8, scale: 2 }),
  requiresShipping: boolean("requires_shipping").notNull().default(true),

  mainImage: text("main_image"),
  galleryImages: jsonb("gallery_images").$type<string[]>(),

  tags: jsonb("tags").$type<string[]>(),
  attributes: jsonb("attributes").$type<Record<string, string | number>>(),

  isFeatured: boolean("is_featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
