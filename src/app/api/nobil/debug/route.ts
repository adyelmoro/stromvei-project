import { NextResponse } from "next/server";

/**
 * Temporary diagnostic endpoint — shows the raw structure of the first
 * station returned by the Nobil API so we can fix the parser.
 * DELETE this file once parsing is confirmed working.
 */
export async function GET() {
  const apiKey = process.env.NOBIL_API_KEY;
  if (!apiKey || apiKey.startsWith("PLACEHOLDER")) {
    return NextResponse.json({ error: "No API key" }, { status: 400 });
  }

  try {
    const url = `https://nobil.no/api/server/datadump.php?apikey=${apiKey}&countrycode=NOR&format=json&type=2`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Nobil returned HTTP ${res.status}`, body: await res.text() },
        { status: 502 }
      );
    }

    const json = await res.json();
    const topLevelKeys = Object.keys(json);
    const stationsObj = json.chargerstations ?? json;
    const allKeys = Object.keys(stationsObj);
    const totalRaw = allKeys.length;
    const firstKey = allKeys[0];
    const firstStation = stationsObj[firstKey];

    return NextResponse.json({
      topLevelKeys,
      totalRaw,
      firstKey,
      firstStation,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
