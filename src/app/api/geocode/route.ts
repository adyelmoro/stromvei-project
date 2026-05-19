import { NextResponse } from "next/server";

/**
 * Nominatim proxy — keeps all geocoding requests server-side so they:
 *   • Don't hit the browser's CSP (no cross-origin fetch from the client)
 *   • Include a proper User-Agent (required by Nominatim ToS)
 *   • Are cached on Vercel's edge (reduces external calls and rate-limit risk)
 *
 * Accepts:
 *   ?q=<free-text>          — address autocomplete (AddressSearch)
 *   ?postalcode=<4-digits>  — postcode coordinate lookup (PostcodeSearch)
 *   &limit=<n>              — optional result count (default 5)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q          = searchParams.get("q");
  const postalcode = searchParams.get("postalcode");
  const limit      = searchParams.get("limit") ?? "5";

  if (!q && !postalcode) {
    return NextResponse.json({ error: "Missing q or postalcode" }, { status: 400 });
  }

  const params = new URLSearchParams({
    format:         "json",
    addressdetails: "1",
    countrycodes:   "no",
    limit,
  });
  if (q)          params.set("q", q);
  if (postalcode) params.set("postalcode", postalcode);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "User-Agent":       "stromvei-app/1.0 (iamayyad@gmail.com)",
          "Accept-Language":  "no",
          "Accept":           "application/json",
        },
        // Cache geocode results for 24 hours — same search returns same places
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Nominatim error" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Geocode failed" }, { status: 502 });
  }
}
