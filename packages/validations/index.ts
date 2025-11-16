import { z } from "zod";

export const currencyEnum = z.enum([
  "USD",
  "EUR",
  "GBP",
  "NGN",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
  "INR",
]);

export const productStatusEnum = z.enum(["active", "draft", "archived"]);

export const productVisibilityEnum = z.enum(["public", "private"]);

export const productSortEnum = z.enum([
  "newest",
  "oldest",
  "price-asc",
  "price-desc",
]);

export const paymentMethodEnum = z.enum([
  "card",
  "paypal",
  "bank_transfer",
  "btc",
  "usdt",
]);

const sizeEnum = z.enum([
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "ONE_SIZE",
  "CUSTOM",
]);

const numericString = z
  .union([z.number(), z.string().regex(/^\d+(\.\d{1,2})?$/)])
  .transform((val) => Number(val));

export const addressSchema = z.object({
  fullName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
});

export const userInfoSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(7, "Password must be atleast 7 characters"),
});

export const orderProductSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  price: numericString,
  name: z.string().optional(),
  productId: z.string().uuid().optional(),
});

export const createOrderSchema = z.object({
  currency: currencyEnum.default("USD"),
  products: z.array(orderProductSchema).min(1),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  userInfo: userInfoSchema.optional(),
  notes: z.string().optional(),
  isGift: z.boolean().optional(),
  paymentMethod: paymentMethodEnum.default("card").optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  sku: z.string().min(1),
  category: z.string().min(1),
  costPrice: numericString,
  price: numericString,
  currency: currencyEnum.default("USD"),
  stockQuantity: z.number().int().min(0).default(0),
  inventoryTracking: z.boolean().default(true),

  barcode: z.string().optional(),
  discountPercentage: z.number().int().min(0).max(100).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  sizes: z.array(sizeEnum).optional(),
  color: z.string().optional(),
  limitedEdition: z.boolean().default(false).optional(),
  dropDate: z.union([z.string().datetime(), z.date()]).optional(),
  weight: numericString.optional(),
  requiresShipping: z.boolean().default(true).optional(),
  mainImage: z.string().url().optional(),
  galleryImages: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  attributes: z.record(z.union([z.string(), z.number()])).optional(),
  isFeatured: z.boolean().default(false).optional(),
  isNew: z.boolean().default(false).optional(),
  status: productStatusEnum.default("draft"),
  visibility: productVisibilityEnum.default("private"),
});

export const productUpdateSchema = productCreateSchema.partial().extend({});

export const productsParamsSchema = z.object({
  page: z
    .union([
      z.number().int().min(1),
      z.string().regex(/^\d+$/).transform(Number),
    ])
    .optional()
    .default(1),
  limit: z
    .union([
      z.number().int().min(1),
      z.string().regex(/^\d+$/).transform(Number),
    ])
    .optional()
    .default(15),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  sort: productSortEnum.optional().default("newest"),
  currency: currencyEnum.optional().default("USD"),
});

export const isValidCurrency = z.object({
  currency: currencyEnum.optional().default("USD"),
});

export const isValidUUID = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export const isValidSlug = z.object({
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/i,
      "Slug can only contain letters, numbers, hyphens, and underscores"
    ),
});

export const isValidEmail = z.object({
  email: z.string().email("Invalid email format"),
});

export const orderStatusEnum = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const adminOrderUpdateSchema = z
  .object({
    status: orderStatusEnum,
    trackingNumber: z.string().optional(),
    adminNotes: z.string().optional(),

    isPaid: z.boolean().optional(),
  })
  .partial()
  .required({ status: true });

export type Login = z.infer<typeof loginSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type UserInfoInput = z.infer<typeof userInfoSchema>;

export type OrderInputType = z.infer<typeof createOrderSchema>;
export type AdminOrderUpdateInput = z.infer<typeof adminOrderUpdateSchema>;

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductsParams = z.infer<typeof productsParamsSchema>;
