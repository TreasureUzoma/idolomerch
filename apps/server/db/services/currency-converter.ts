import { envConfig } from "../../config";
import { getRedis } from "../redis-client";

type ExchangeApiResponse = {
  result: string;
  "error-type"?: string;
  conversion_rate: number;
  time_last_update_utc: string;
};

type ExchangeErrorResponse = {
  error: string;
  details?: string;
};

export const getConversionRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  if (fromCurrency === toCurrency) return 1;

  const redis = await getRedis();
  const cacheKey = `exchange-rate:${fromCurrency}:${toCurrency}`;
  let rate = await redis.get(cacheKey);

  if (!rate) {
    const url = `https://v6.exchangerate-api.com/v6/${envConfig.EXCHANGE_RATE_API_KEY}/pair/${fromCurrency}/${toCurrency}`;
    const res = await fetch(url);
    const json = (await res.json()) as
      | ExchangeApiResponse
      | ExchangeErrorResponse;

    if ("error" in json)
      throw new Error(json.error || "Failed to fetch exchange rate");

    rate = (json as ExchangeApiResponse).conversion_rate.toString();
    await redis.set(cacheKey, rate, { EX: 60 * 60 });
  }

  return Number(rate);
};

export const currencyConverter = {
  getRate: getConversionRate,
};
