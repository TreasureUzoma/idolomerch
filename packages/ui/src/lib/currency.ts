type RatesResponse = {
  data?: Record<string, number>;
  error?: string;
};

export async function convertCurrency(
  amount: number,
  toCurrency: string,
  base: string = "USD"
): Promise<number> {
  try {
    if (base === toCurrency) return amount;

    const res = await fetch(`/api/currency?base=${base}&symbol=${toCurrency}`);

    if (!res.ok) throw new Error("Failed to fetch exchange rates");

    const data: RatesResponse = await res.json();

    if (!data.data || !data.data[toCurrency]) {
      throw new Error(`Currency ${toCurrency} not available in response`);
    }

    const rate = data.data[toCurrency];
    return amount * rate;
  } catch (err) {
    // console.error("Currency conversion error:", err);
    return 0; //
  }
}
