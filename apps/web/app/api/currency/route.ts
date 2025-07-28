import { NextRequest, NextResponse } from "next/server";

type ExchangeApiResponse = {
  result: string;
  "error-type"?: string;
  conversion_rate: number;
  time_last_update_utc: string;
};

type ExchangeSuccessResponse = {
  data: Record<string, number>;
  meta: {
    source: string;
    last_updated_at: string;
  };
};

type ExchangeErrorResponse = {
  error: string;
  details?: string;
};

export async function GET(req: NextRequest): Promise<NextResponse<ExchangeSuccessResponse | ExchangeErrorResponse>> {
  const { searchParams } = req.nextUrl;
  const base = searchParams.get("base") ?? "USD";
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json(
      { error: "Missing 'symbol' query parameter" },
      { status: 400 }
    );
  }

  const apiKey = process.env.CURRENCY_CONVERTER_API;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ExchangeRate API key" },
      { status: 500 }
    );
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base}/${symbol}`;

  try {
    const response = await fetch(url);
    const result = (await response.json()) as ExchangeApiResponse;

    if (result.result !== "success") {
      throw new Error(result["error-type"] || "Unknown error from exchange API");
    }

    return NextResponse.json({
      data: {
        [symbol]: result.conversion_rate,
      },
      meta: {
        source: "exchangerate-api.com",
        last_updated_at: result.time_last_update_utc,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch exchange rate",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
