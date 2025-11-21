import { API_BASE_URL } from "@workspace/constants/";

export async function fetchProducts(
  currency: string,
  page: number,
  category?: string
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products?page=${page}&currency=${currency}&category=${category}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
