import { API_BASE_URL } from "@workspace/constants/";

export async function fetchProducts(
  currency: string,
  page: number,
  category?: string
): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/products`);

    const params = url.searchParams;

    params.append("page", String(page));
    params.append("currency", currency);

    if (category && category.trim() !== "") {
      params.append("category", category.trim());
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(API_BASE_URL);
      console.log(response);
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
