import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const cleanCode = (code || "").trim();

    if (!/^\d{6}$/.test(cleanCode)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 6-digit Indian pincode" },
        { status: 400 }
      );
    }

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanCode}`, {
      headers: { "User-Agent": "BhaamaVeedhi/1.0" },
      next: { revalidate: 86400 }, // Cache 24 hours
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Unable to query pincode service" },
        { status: 502 }
      );
    }

    const data = await res.json();
    if (
      Array.isArray(data) &&
      data[0] &&
      data[0].Status === "Success" &&
      Array.isArray(data[0].PostOffice) &&
      data[0].PostOffice.length > 0
    ) {
      const first = data[0].PostOffice[0];
      const offices = data[0].PostOffice.map((p: { Name: string }) => p.Name);
      return NextResponse.json({
        success: true,
        district: first.District || first.Block || "",
        state: first.State || "",
        circle: first.Circle || "",
        postOffices: offices,
      });
    }

    return NextResponse.json(
      { success: false, error: "Pincode not found. Please enter city and state manually." },
      { status: 404 }
    );
  } catch (err) {
    console.error("Pincode lookup error:", err);
    return NextResponse.json(
      { success: false, error: "Pincode lookup service unavailable" },
      { status: 500 }
    );
  }
}

