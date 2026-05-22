import { NextResponse } from "next/server";
import { fetchAllStations } from "@/lib/nobil";
import { MOCK_STATIONS } from "@/lib/mock-stations";

// Cache the response at Vercel's CDN for 15 min so cold-start serverless
// invocations don't re-fetch 5 000+ stations from nobil.no each time.
export const revalidate = 900;

export async function GET() {
  const apiKey = process.env.NOBIL_API_KEY;

  // Use mock data until real key arrives
  if (!apiKey || apiKey.startsWith("PLACEHOLDER")) {
    return NextResponse.json({
      stations: MOCK_STATIONS,
      count: MOCK_STATIONS.length,
      cached: false,
      mock: true,
    });
  }

  try {
    const stations = await fetchAllStations(apiKey);
    return NextResponse.json({
      stations,
      count: stations.length,
      cached: true,
      mock: false,
    });
  } catch (err) {
    console.error("Nobil API fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch stations" },
      { status: 502 }
    );
  }
}
