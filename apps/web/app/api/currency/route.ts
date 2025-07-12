import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const base = searchParams.get("base") ?? "USD";
  const symbols = searchParams.get("symbol") ?? "";
  const apiKey = process.env.CURRENCY_CONVERTER_API;

  // handle USD → NGN manually (1 USD = 1700 NGN)
  if (base === "USD" && symbols === "NGN") {
    return NextResponse.json({
      data: {
        NGN: 1700,
      },
      meta: {
        source: "manual",
        note: "Static conversion used for USD → NGN (1 USD = 1700 NGN)",
        last_updated_at: new Date().toISOString(),
      },
    });
  }

  // handle all other cases via live API
  const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${base}&currencies=${symbols}`;

  try {
    const response = await fetch(url);
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong while fetching exchange rates",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
