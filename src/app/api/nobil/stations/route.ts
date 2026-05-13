import { NextResponse } from "next/server";
import { fetchAllStations } from "@/lib/nobil";
import { MOCK_STATIONS } from "@/lib/mock-stations";

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
